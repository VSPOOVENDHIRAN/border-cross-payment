// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title EmergencyPayment
 * @dev Smart contract for cross-country emergency medical payments
 * @notice This is an academic prototype - no real ETH transfers implemented
 */
contract EmergencyPayment {
    
    // ============================================
    // STATE VARIABLES
    // ============================================
    
    // Structure to store hospital information
    struct Hospital {
        string name;
        string country;
        address walletAddress;
        bool isRegistered;
        uint256 registeredAt;
    }
    
    // Structure to store user information
    struct User {
        string name;
        string country;
        address walletAddress;
        bool isRegistered;
        uint256 registeredAt;
    }
    
    // Structure to store payment information
    struct Payment {
        uint256 paymentId;
        address sender;
        address receiver;
        uint256 amount;
        string surgeryId;
        uint256 timestamp;
        bool isCompleted;
    }
    
    // Mappings to store data
    mapping(address => Hospital) public hospitals;
    mapping(address => User) public users;
    mapping(uint256 => Payment) public payments;
    
    // Counters
    uint256 public hospitalCount;
    uint256 public userCount;
    uint256 public paymentCount;
    
    // ============================================
    // EVENTS
    // ============================================
    
    event HospitalRegistered(
        address indexed hospitalAddress,
        string name,
        string country,
        uint256 timestamp
    );
    
    event UserRegistered(
        address indexed userAddress,
        string name,
        string country,
        uint256 timestamp
    );
    
    event EmergencyPaymentProcessed(
        uint256 indexed paymentId,
        address indexed sender,
        address indexed receiver,
        uint256 amount,
        string surgeryId,
        uint256 timestamp
    );
    
    // ============================================
    // FUNCTIONS
    // ============================================
    
    /**
     * @dev Register a hospital in the system
     * @param _name Hospital name
     * @param _country Country where hospital is located
     */
    function registerHospital(string memory _name, string memory _country) public {
        require(!hospitals[msg.sender].isRegistered, "Hospital already registered");
        require(bytes(_name).length > 0, "Hospital name cannot be empty");
        require(bytes(_country).length > 0, "Country cannot be empty");
        
        hospitals[msg.sender] = Hospital({
            name: _name,
            country: _country,
            walletAddress: msg.sender,
            isRegistered: true,
            registeredAt: block.timestamp
        });
        
        hospitalCount++;
        
        emit HospitalRegistered(msg.sender, _name, _country, block.timestamp);
    }
    
    /**
     * @dev Register a user in the system
     * @param _name User name
     * @param _country Country where user is located
     */
    function registerUser(string memory _name, string memory _country) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        require(bytes(_name).length > 0, "User name cannot be empty");
        require(bytes(_country).length > 0, "Country cannot be empty");
        
        users[msg.sender] = User({
            name: _name,
            country: _country,
            walletAddress: msg.sender,
            isRegistered: true,
            registeredAt: block.timestamp
        });
        
        userCount++;
        
        emit UserRegistered(msg.sender, _name, _country, block.timestamp);
    }
    
    /**
     * @dev Process an emergency payment for surgery
     * @param _receiver Hospital wallet address
     * @param _amount Payment amount (in wei for simulation)
     * @param _surgeryId Unique surgery identifier
     */
    function emergencyPayment(
        address _receiver,
        uint256 _amount,
        string memory _surgeryId
    ) public {
        require(users[msg.sender].isRegistered, "Sender must be registered user");
        require(hospitals[_receiver].isRegistered, "Receiver must be registered hospital");
        require(_amount > 0, "Payment amount must be greater than 0");
        require(bytes(_surgeryId).length > 0, "Surgery ID cannot be empty");
        
        paymentCount++;
        
        payments[paymentCount] = Payment({
            paymentId: paymentCount,
            sender: msg.sender,
            receiver: _receiver,
            amount: _amount,
            surgeryId: _surgeryId,
            timestamp: block.timestamp,
            isCompleted: true
        });
        
        // NOTE: In a real implementation, this would transfer actual ETH
        // For academic prototype, we just log the transaction
        
        emit EmergencyPaymentProcessed(
            paymentCount,
            msg.sender,
            _receiver,
            _amount,
            _surgeryId,
            block.timestamp
        );
    }
    
    /**
     * @dev Get hospital details by address
     * @param _hospitalAddress Hospital wallet address
     * @return Hospital information
     */
    function getHospital(address _hospitalAddress) public view returns (
        string memory name,
        string memory country,
        address walletAddress,
        bool isRegistered,
        uint256 registeredAt
    ) {
        Hospital memory hospital = hospitals[_hospitalAddress];
        return (
            hospital.name,
            hospital.country,
            hospital.walletAddress,
            hospital.isRegistered,
            hospital.registeredAt
        );
    }
    
    /**
     * @dev Get user details by address
     * @param _userAddress User wallet address
     * @return User information
     */
    function getUser(address _userAddress) public view returns (
        string memory name,
        string memory country,
        address walletAddress,
        bool isRegistered,
        uint256 registeredAt
    ) {
        User memory user = users[_userAddress];
        return (
            user.name,
            user.country,
            user.walletAddress,
            user.isRegistered,
            user.registeredAt
        );
    }
    
    /**
     * @dev Get payment details by ID
     * @param _paymentId Payment ID
     * @return Payment information
     */
    function getPayment(uint256 _paymentId) public view returns (
        uint256 paymentId,
        address sender,
        address receiver,
        uint256 amount,
        string memory surgeryId,
        uint256 timestamp,
        bool isCompleted
    ) {
        Payment memory payment = payments[_paymentId];
        return (
            payment.paymentId,
            payment.sender,
            payment.receiver,
            payment.amount,
            payment.surgeryId,
            payment.timestamp,
            payment.isCompleted
        );
    }
}
