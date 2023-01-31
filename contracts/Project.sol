// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;


contract Project{

    address private owner_;
    bool private opened_;
    string private image_;
    string private description_;

    uint public constant duration = 30;
    uint public immutable end;

    receive() external payable {}

    fallback() external payable {}

    constructor(address _owner, string memory _image, string memory _description) {
        owner_ = _owner;
        image_ = _image;
        description_ = _description;
        opened_ = true;
        end = block.timestamp + duration;
    }

    function owner() public view returns(address){
        return owner_;
    } 

    function image() public view returns(string memory){
        return image_;
    }

    function description() public view returns(string memory){
        return description_;
    }

    function opened() public view returns(bool){
        return opened_;
    }

    function timeLeft() public view returns(uint){        
        require(block.timestamp <= end,"error time left is over");
        return end-block.timestamp;
        
    }

    modifier valid_withdraw{
        require(block.timestamp >= end,"Error: Project Locked");
        _;
    }

    function withdraw() public valid_withdraw{

        opened_ = false;
        (bool sent,) = owner_.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether to owner");
    }

}

contract ProjectFactory{

    event NewDonation(address sender, uint amount);
    event UnlockedProject(address project);

    mapping (address => Project) private projects;
    address payable[] private project_list_;

    uint public total_projects;

    function newProject(string memory _image, string memory _description) public {
        Project new_project = new Project(msg.sender, _image,_description);

        ++total_projects;

        project_list_.push(payable(address(new_project)));
        projects[address(new_project)] = new_project;
    }

    function donate(address payable _to) public payable{

        (bool sent,) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        emit NewDonation(msg.sender, msg.value);

    }

    function project_list() public view returns (address payable[] memory){
        return project_list_;
    }

    modifier projectExist(address pa){
        require(address(projects[pa]) != address(0),"Project doesnt exists");
        _;
    }

    function return_project(address _project_address) public projectExist(_project_address) view returns(address, string memory, string memory, bool){
        
        Project project = Project(projects[_project_address]);

        address owner_ = project.owner();
        string memory image_ = project.image();
        string memory description_ = project.description();
        bool opened_ = project.opened();

        return (owner_,image_,description_,opened_);
    }

    function timeLeftContractUnlock(address project_addr) public projectExist(project_addr) view returns(uint){
        Project project = Project(projects[project_addr]);

        return project.timeLeft();
    }


    function sendFundsToOwner(address project_addr) public projectExist(project_addr){
        Project project = Project(projects[project_addr]);
        require(project.opened() == true,"Project already withdrew");

        project.withdraw();
        
    }

}