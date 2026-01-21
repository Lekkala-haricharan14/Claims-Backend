# 🧾 Claims Microservice

A role-based claims management microservice built with Node.js, Express, and MongoDB. Enables customers to apply for insurance claims, claim officers to process them, and agents to view assigned claims.

---

## 🎯 Features

✅ **Role-Based Access Control (RBAC)**
- **Customers**: Apply for claims, upload documents, view own claims
- **Claim Officers**: Process claims (approve/reject/pending), view all claims with filters
- **Agents**: View assigned claims (read-only)

✅ **Claims Management**
- Create claims with detailed information
- Upload supporting documents
- Track claim status (Pending → Approved/Rejected)
- Advanced filtering and search

✅ **Microservices Architecture**
- Claims service operates independently
- Customers and Agents managed by other microservices (referenced by ID)
- Claim Officers stored locally for claims processing

✅ **Security Ready**
- Header-based RBAC (current)
- JWT integration ready (future)
- Ownership validation for claim modifications

---

## 🛠️ Tech Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **dotenv** - Environment variables
- **cors** - Cross-origin support
- **nodemon** - Development auto-reload

---

## 🚀 Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone repository**
```bash
git clone https://github.com/Lekkala-haricharan14/Claims-Backend.git
cd Claims-Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file** (`.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/claims
NODE_ENV=development
```

4. **Start MongoDB**
```bash
mongod
```

5. **Run server**
```bash
npm start
```

Server will start on `http://localhost:5000`

---

## 📚 API Documentation

### Authentication Headers

All endpoints (except `GET /`) require these headers:
```
X-User-Role: "customer" | "agent" | "claimOfficer"
X-User-Id: <numeric-id>
```

---

## 🔑 Role-Based Endpoints

### **CUSTOMER Endpoints**

#### 1. Create Claim
```http
POST /api/claims
X-User-Role: customer
X-User-Id: 301

{
  "claimId": 1001,
  "policyId": 501,
  "policyholderId": 301,
  "agentId": 201,
  "claimReason": "Hospitalization",
  "claimType": "Medical",
  "incidentDate": "2025-01-10",
  "claimAmtRequested": 60000
}
```

**Response:** `201 Created`

#### 2. View Own Claims
```http
GET /api/claims
X-User-Role: customer
X-User-Id: 301
```

**Response:** `200 OK` - Returns only claims where `policyholderId = 301`

#### 3. Upload Documents
```http
PUT /api/claims/1001/documents
X-User-Role: customer
X-User-Id: 301

{
  "documents": [
    "uploads/bill1.pdf",
    "uploads/report.jpg"
  ]
}
```

**Response:** `200 OK` - Updated claim object with documents appended

---

### **AGENT Endpoints**

#### View Assigned Claims
```http
GET /api/claims
X-User-Role: agent
X-User-Id: 201
```

**Response:** `200 OK` - Returns only claims where `agentId = 201` (read-only)

---

### **CLAIM OFFICER Endpoints**

#### 1. View All Claims
```http
GET /api/claims
X-User-Role: claimOfficer
X-User-Id: 401
```

**Optional Query Parameters:**
```
?claimId=1001
?policyholderId=301
?agentId=201
?claimStatus=Pending
?claimStatus=Approved
?claimStatus=Rejected
```

#### 2. Update Claim Status
```http
PUT /api/claims/1001/status
X-User-Role: claimOfficer
X-User-Id: 401

{
  "claimStatus": "Approved",
  "statusReason": "Documents verified",
  "approvedAmt": 45000,
  "claimOfficerId": 401
}
```

**Valid Status Values:** `Pending` | `Approved` | `Rejected`

**Rules:**
- `approvedAmt` is REQUIRED when `claimStatus = "Approved"`
- `statusUpdatedDate` is auto-generated
- Only claim officers can access this endpoint

**Response:** `200 OK` - Updated claim object

---

### **ADMIN Endpoints (Setup Only)**

#### Create Claim Officer
```http
POST /api/claimofficers

{
  "claimOfficerId": 401,
  "claimOfficerName": "Bob Wilson",
  "email": "bob@example.com",
  "phone": "9876543212"
}
```

---

## 🏗️ Project Structure

```
Claims-Backend/
├── src/
│   ├── app.js                      # Express app setup
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── models/
│   │   ├── Claim.js                # Claim schema
│   │   └── ClaimOfficer.js         # Claim Officer schema
│   ├── controllers/
│   │   ├── claim.controller.js     # Claim business logic
│   │   └── claimOfficer.controller.js
│   ├── routes/
│   │   ├── claim.routes.js         # Claim endpoints
│   │   └── claimOfficer.routes.js
│   └── middleware/
│       └── roleCheck.js            # RBAC middleware
├── server.js                        # Entry point
├── package.json
└── README.md
```

---

## 🔐 Role-Based Access Control (RBAC)

### How It Works

**1. Middleware Layer** (`src/middleware/roleCheck.js`)
- Validates `X-User-Role` and `X-User-Id` headers
- Checks if role is allowed for the endpoint
- Attaches `req.user = { role, id }` to request

**2. Route Layer** (`src/routes/claim.routes.js`)
- Each route specifies allowed roles
```javascript
router.post("/", checkRole(["customer"]), createClaim);
router.put("/:claimId/status", checkRole(["claimOfficer"]), updateClaimStatus);
```

**3. Controller Layer** (`src/controllers/claim.controller.js`)
- Role-based filtering applied automatically
- Ownership validation for sensitive operations

### Access Matrix

| Operation | Customer | Agent | Claim Officer |
|-----------|----------|-------|---------------|
| Create Claim | ✅ (own) | ❌ | ❌ |
| View Claims | ✅ (own) | ✅ (assigned) | ✅ (all) |
| Filter Claims | ❌ | ❌ | ✅ |
| Upload Documents | ✅ (own, Pending only) | ❌ | ❌ |
| Update Status | ❌ | ❌ | ✅ |

---

## 🧪 Usage Examples

### Example 1: Customer Applies for Claim

```bash
# Step 1: Create claim
curl -X POST http://localhost:5000/api/claims \
  -H "Content-Type: application/json" \
  -H "X-User-Role: customer" \
  -H "X-User-Id: 301" \
  -d '{
    "claimId": 1001,
    "policyId": 501,
    "policyholderId": 301,
    "agentId": 201,
    "claimReason": "Emergency Medical Treatment",
    "claimType": "Medical",
    "incidentDate": "2025-01-15",
    "claimAmtRequested": 75000
  }'

# Step 2: View own claims
curl http://localhost:5000/api/claims \
  -H "X-User-Role: customer" \
  -H "X-User-Id: 301"

# Step 3: Upload supporting documents
curl -X PUT http://localhost:5000/api/claims/1001/documents \
  -H "Content-Type: application/json" \
  -H "X-User-Role: customer" \
  -H "X-User-Id: 301" \
  -d '{
    "documents": ["uploads/hospital_bill.pdf", "uploads/prescription.jpg"]
  }'
```

### Example 2: Claim Officer Processes Claim

```bash
# View all pending claims
curl http://localhost:5000/api/claims?claimStatus=Pending \
  -H "X-User-Role: claimOfficer" \
  -H "X-User-Id: 401"

# Approve claim
curl -X PUT http://localhost:5000/api/claims/1001/status \
  -H "Content-Type: application/json" \
  -H "X-User-Role: claimOfficer" \
  -H "X-User-Id: 401" \
  -d '{
    "claimStatus": "Approved",
    "statusReason": "All documents verified and approved",
    "approvedAmt": 70000,
    "claimOfficerId": 401
  }'
```

### Example 3: Agent Views Assigned Claims

```bash
curl http://localhost:5000/api/claims \
  -H "X-User-Role: agent" \
  -H "X-User-Id: 201"
# Returns only claims assigned to agent 201
```

---

## 📊 Database Schema

### Claim Collection
```javascript
{
  claimId: Number,              // Unique claim ID
  policyId: Number,             // Foreign key to Policy MS
  policyholderId: Number,       // Foreign key to Customer MS
  agentId: Number,              // Foreign key to Agent MS
  claimOfficerId: Number,       // Assigned officer ID
  claimReason: String,
  claimType: String,
  claimStatus: String,          // Pending | Approved | Rejected
  incidentDate: Date,
  claimDate: Date,
  claimAmtRequested: Number,
  approvedAmt: Number,          // Set when approved
  statusReason: String,
  statusUpdatedDate: Date,
  supportingDocuments: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### ClaimOfficer Collection
```javascript
{
  claimOfficerId: Number,       // Unique officer ID
  claimOfficerName: String,
  email: String,                // Unique
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ⚠️ Common Error Responses

### Missing Authentication Headers
```json
{
  "error": "Missing credentials",
  "message": "Please provide X-User-Role and X-User-Id headers"
}
```
Status: `401 Unauthorized`

### Insufficient Permissions
```json
{
  "error": "Forbidden",
  "message": "Access denied. Required role(s): claimOfficer",
  "userRole": "agent"
}
```
Status: `403 Forbidden`

### Not Claim Owner
```json
{
  "error": "Forbidden",
  "message": "You can only modify your own claims"
}
```
Status: `403 Forbidden`

### Invalid Operation
```json
{
  "error": "Invalid operation",
  "message": "Cannot upload documents for approved/rejected claims"
}
```
Status: `400 Bad Request`

---

## 🔄 Future Enhancements

### Phase 2: JWT Integration ⏳
Currently using header-based auth. Plan to add:
- JWT token generation on login
- Token refresh mechanism  
- Expiration handling
- **No changes needed to routes/controllers** ✅

**Migration:**
```javascript
// Only update: src/middleware/roleCheck.js
// From: const userRole = req.headers["x-user-role"];
// To:   const decoded = jwt.verify(token, SECRET);
```

### Phase 3: Additional Features
- Claim history/audit trail
- Email notifications
- Document storage (AWS S3)
- Advanced analytics
- Claim appeals mechanism

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running: `mongod`

### Missing Headers Error
```
"error": "Missing credentials"
```
**Solution:** Always include both headers in requests

### Invalid Role
```
"error": "Access denied"
```
**Solution:** Use valid roles: `customer`, `agent`, or `claimOfficer`

---

## 📝 Development Notes

- **No JWT yet** - Using simple header-based auth for development
- **Microservices**: Customers and Agents referenced by ID only
- **Validation**: Role and ownership checks at middleware + controller level
- **Error Handling**: Comprehensive error messages for debugging

---

## 📄 License

This project is part of the Insurance Management System.

---

## 👤 Author

**Lekkala Haricharan**

---

## 📞 Support

For issues or questions, create an issue in the repository.

---

## 🚀 Features

- Create insurance claims (Policyholder)
- Upload supporting documents (Policyholder)
- Update claim status (Claim Officer only)
- Read claims using multiple filters:
  - claimId
  - policyholderId
  - agentId
  - claimOfficerId
  - claimStatus
- MongoDB integration using Mongoose
- RESTful API design
---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **dotenv**
- **cors**
- **nodemon**

---


