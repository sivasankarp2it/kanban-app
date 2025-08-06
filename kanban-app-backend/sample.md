### Register User
POST /api/auth/register
Headers:
Content-Type: application/json
Body:
{
  "name": "Siva Sankar",
  "email": "siva@example.com",
  "password": "password123"
}

### Login User
POST /api/auth/login
Headers:
Content-Type: application/json
Body:
{
  "email": "siva@example.com",
  "password": "password123"
}

### Create Workspace
POST /api/workspaces
Headers:
Authorization: Bearer <your_token>
Content-Type: application/json
Body:
{
  "name": "Development Workspace"
}

### Get All Workspaces
GET /api/workspaces
Headers:
Authorization: Bearer <your_token>

### Get Single Workspace
GET /api/workspaces/<workspace_id>
Headers:
Authorization: Bearer <your_token>

### Update Workspace
PUT /api/workspaces/<workspace_id>
Headers:
Authorization: Bearer <your_token>
Content-Type: application/json
Body:
{
  "name": "Updated Workspace Name"
}

### Delete Workspace
DELETE /api/workspaces/<workspace_id>
Headers:
Authorization: Bearer <your_token>

### Create Board
POST /api/boards
Headers:
Authorization: Bearer <your_token>
Content-Type: application/json
Body:
{
  "name": "Frontend Board",
  "workspaceId": "<workspace_id>"
}

### Get Boards of a Workspace
GET /api/boards/workspace/<workspace_id>
Headers:
Authorization: Bearer <your_token>

### Get Single Board
GET /api/boards/<board_id>
Headers:
Authorization: Bearer <your_token>

### Update Board
PUT /api/boards/<board_id>
Headers:
Authorization: Bearer <your_token>
Content-Type: application/json
Body:
{
  "name": "Updated Board Name"
}

### Delete Board
DELETE /api/boards/<board_id>
Headers:
Authorization: Bearer <your_token>

### Create Task
POST /api/tasks
Headers:
Authorization: Bearer <your_token>
Content-Type: application/json
Body:
{
  "title": "Design Login Page",
  "description": "Create UI for login",
  "status": "todo",
  "boardId": "<board_id>"
}

### Get Tasks for Board
GET /api/tasks/<board_id>
Headers:
Authorization: Bearer <your_token>

### Get Task by ID
GET /api/tasks/details/<task_id>
Headers:
Authorization: Bearer <your_token>

### Update Task
PUT /api/tasks/<task_id>
Headers:
Authorization: Bearer <your_token>
Content-Type: application/json
Body:
{
  "title": "Updated Login Page",
  "description": "Refactor and add validation",
  "status": "inprogress"
}

### Delete Task
DELETE /api/tasks/<task_id>
Headers:
Authorization: Bearer <your_token>