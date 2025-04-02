# Jay's Frames API Documentation

This document provides details on all available API endpoints in the Jay's Frames application.

## Base URL

All endpoints are relative to the base URL of your deployment, for example:
- Local development: `http://localhost:5000`
- Production: `https://your-domain.com`

## Authentication

Currently, the API does not use authentication. This will be implemented in future versions.

## Product APIs

### Get All Products

Retrieves all available products.

- **URL**: `/api/products`
- **Method**: GET
- **URL Parameters**: None
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of product objects
  ```json
  [
    {
      "id": 1,
      "name": "Custom Frame",
      "description": "Tailor-made frames designed for your specific artwork.",
      "price": 19400,
      "category": "frame",
      "imageUrl": "https://example.com/image.jpg",
      "details": {
        "sizes": ["8x10", "11x14", "16x20", "18x24", "24x36"],
        "frameOptions": [1, 2, 3]
      }
    }
  ]
  ```

### Get Products by Category

Retrieves products filtered by a specific category.

- **URL**: `/api/products/category/:category`
- **Method**: GET
- **URL Parameters**: 
  - `category` - Product category (e.g., "frame", "shadowbox", "moonmount")
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of product objects in the specified category

### Get Product by ID

Retrieves a single product by its ID.

- **URL**: `/api/products/:id`
- **Method**: GET
- **URL Parameters**: 
  - `id` - The product ID
- **Success Response**:
  - **Code**: 200
  - **Content**: Product object
- **Error Response**:
  - **Code**: 404
  - **Content**: `{ "message": "Product not found" }`

## Framing Options APIs

### Get Frame Options

Retrieves all available frame options.

- **URL**: `/api/frame-options`
- **Method**: GET
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of frame option objects
  ```json
  [
    {
      "id": 1,
      "name": "Classic Black",
      "color": "#000000",
      "material": "Wood",
      "pricePerInch": 75
    }
  ]
  ```

### Get Mat Options

Retrieves all available mat options.

- **URL**: `/api/mat-options`
- **Method**: GET
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of mat option objects
  ```json
  [
    {
      "id": 1,
      "name": "Ivory",
      "color": "#FFFFF0",
      "price": 1500
    }
  ]
  ```

### Get Glass Options

Retrieves all available glass options.

- **URL**: `/api/glass-options`
- **Method**: GET
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of glass option objects
  ```json
  [
    {
      "id": 1,
      "name": "Standard Clear",
      "description": "Basic glass with UV protection",
      "price": 1000
    }
  ]
  ```

## Order APIs

### Create Order

Creates a new order.

- **URL**: `/api/orders`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "items": [
      {
        "productId": 1,
        "name": "Custom Frame",
        "price": 19400,
        "quantity": 1,
        "details": {
          "width": 16,
          "height": 20,
          "frameId": 1,
          "matId": 2,
          "glassId": 1
        }
      }
    ]
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: The created order object with ID and status
- **Error Response**:
  - **Code**: 400
  - **Content**: `{ "message": "Invalid order data" }`

### Get Order by ID

Retrieves order details by ID.

- **URL**: `/api/orders/:id`
- **Method**: GET
- **URL Parameters**: 
  - `id` - The order ID
- **Success Response**:
  - **Code**: 200
  - **Content**: Order details including status and items
- **Error Response**:
  - **Code**: 404
  - **Content**: `{ "message": "Order not found" }`

### Update Order Status

Updates the status of an existing order.

- **URL**: `/api/orders/:id/status`
- **Method**: PATCH
- **URL Parameters**: 
  - `id` - The order ID
- **Request Body**:
  ```json
  {
    "status": "processing",
    "stage": "design_approval"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: Updated order object
- **Error Response**:
  - **Code**: 404
  - **Content**: `{ "message": "Order not found" }`

### Get All Orders

Retrieves all orders (admin access).

- **URL**: `/api/orders`
- **Method**: GET
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of order objects

## AI-powered APIs

### Chat API

Interact with the AI assistant for general inquiries, product recommendations, or order status.

- **URL**: `/api/chat`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "sessionId": "unique-session-identifier",
    "message": "What frame would you recommend for a watercolor painting?",
    "orderNumber": "123456" // Optional, if checking order status
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: 
  ```json
  {
    "message": "For a watercolor painting, I recommend a...",
    "productRecommendations": [
      {
        "id": 1,
        "name": "Custom Frame",
        "description": "Tailor-made frames designed for your specific artwork.",
        "price": 19400,
        "category": "frame"
      }
    ],
    "orderInfo": {} // Will contain order info if order status was queried
  }
  ```

### Frame Recommendations API

Get AI-powered frame and mat recommendations based on artwork description.

- **URL**: `/api/frame-recommendations`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "artworkDescription": "A vibrant watercolor painting of a sunset over the ocean with orange and purple hues"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: 
  ```json
  {
    "frames": [
      {
        "id": 3,
        "name": "Natural Wood",
        "color": "#D2B48C",
        "material": "Wood",
        "pricePerInch": 65
      }
    ],
    "mats": [
      {
        "id": 2,
        "name": "Off-White",
        "color": "#F5F5F5",
        "price": 1800
      }
    ],
    "explanation": "For your vibrant watercolor sunset painting, I recommend a natural wood frame to complement the warm tones..."
  }
  ```

### Frame Assistant API

Direct interface to the Frame Design Assistant for framing advice.

- **URL**: `/api/frame-assistant`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "message": "Can you suggest a good frame for a family portrait?"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: 
  ```json
  {
    "response": "For a family portrait, I would recommend a classic black frame with an off-white mat to create a timeless look..."
  }
  ```

## Error Handling

All endpoints will return appropriate HTTP status codes:

- `200 OK`: The request was successful
- `201 Created`: The resource was successfully created
- `400 Bad Request`: The request was malformed or invalid
- `404 Not Found`: The requested resource was not found
- `500 Internal Server Error`: An unexpected server error occurred

## Rate Limiting

Currently, there are no rate limits implemented on the API. This may change in future versions.