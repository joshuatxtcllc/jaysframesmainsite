# Routes and Navigation Documentation for Jay's Frames

## Frontend Routes

### Main Client Routes
The following routes are defined in the application and registered in `client/src/App.tsx`:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Home` | Landing page with hero section, process explanation, and testimonials |
| `/products` | `Products` | Browse and filter all available products |
| `/custom-framing` | `CustomFraming` | Interactive frame design experience |
| `/order-status` | `OrderStatus` | Track order status and view timeline |
| `/frame-assistant-test` | `FrameAssistantTest` | Test page for direct Frame Design Assistant access |
| `/admin` | `AdminDashboard` | Admin dashboard for order management |
| `*` | `NotFound` | 404 page for undefined routes |

### Route Implementation
Routes are defined using the `wouter` library in `client/src/App.tsx`:

```typescript
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/custom-framing" component={CustomFraming} />
      <Route path="/order-status" component={OrderStatus} />
      <Route path="/frame-assistant-test" component={FrameAssistantTest} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}
```

### Navigation Components
Navigation is provided through the Header component:

```typescript
// client/src/components/layout/header.tsx simplified example
export default function Header() {
  return (
    <header className="...">
      <div className="...">
        <Link href="/" className="...">
          <span className="...">Jay's Frames</span>
        </Link>
        
        <nav className="...">
          <ul className="...">
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/custom-framing">Custom Framing</Link></li>
            <li><Link href="/order-status">Order Status</Link></li>
          </ul>
        </nav>
        
        <div className="...">
          {/* Cart button */}
          {/* Admin link if admin user */}
        </div>
      </div>
    </header>
  );
}
```

## Backend API Endpoints

### Products
| Method | Endpoint | Controller | Description |
|--------|----------|------------|-------------|
| GET | `/api/products` | `getProducts` | Get all products |
| GET | `/api/products/category/:category` | `getProductsByCategory` | Get products by category |
| GET | `/api/products/:id` | `getProductById` | Get product by ID |

### Frame Options
| Method | Endpoint | Controller | Description |
|--------|----------|------------|-------------|
| GET | `/api/frame-options` | `getFrameOptions` | Get all frame options |

### Mat Options
| Method | Endpoint | Controller | Description |
|--------|----------|------------|-------------|
| GET | `/api/mat-options` | `getMatOptions` | Get all mat options |

### Glass Options
| Method | Endpoint | Controller | Description |
|--------|----------|------------|-------------|
| GET | `/api/glass-options` | `getGlassOptions` | Get all glass options |

### Orders
| Method | Endpoint | Controller | Description |
|--------|----------|------------|-------------|
| POST | `/api/orders` | `createOrder` | Create a new order |
| GET | `/api/orders/:id` | `getOrderById` | Get order by ID |
| PATCH | `/api/orders/:id/status` | `updateOrderStatus` | Update order status |
| GET | `/api/orders` | `getOrders` | Get all orders |

### AI Features
| Method | Endpoint | Controller | Description |
|--------|----------|------------|-------------|
| POST | `/api/chat` | `handleChat` | Send a message to the chatbot |
| POST | `/api/frame-recommendations` | `getFrameRecommendations` | Get frame recommendations for artwork |
| POST | `/api/frame-assistant` | `askFrameAssistant` | Ask a question to the Frame Design Assistant |

## API Request Implementation

The application uses a common `apiRequest` function defined in `client/src/lib/queryClient.ts` to make API requests:

```typescript
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}
```

## React Query Integration

The application uses React Query (TanStack Query) for data fetching. A shared `queryClient` is defined in `client/src/lib/queryClient.ts`:

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});
```

### Example Query Usage

```typescript
// Example product list query
const { data: products, isLoading } = useQuery({
  queryKey: ['/api/products'],
});

// Example order by ID query
const { data: order, isLoading } = useQuery({
  queryKey: [`/api/orders/${orderId}`],
  enabled: !!orderId,
});

// Example create order mutation
const createOrderMutation = useMutation({
  mutationFn: async (orderData: InsertOrder) => {
    const response = await apiRequest('POST', '/api/orders', orderData);
    return response.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    toast({
      title: "Order created successfully",
      description: "Your order has been placed and is being processed.",
    });
  },
});
```

## Cart Navigation

The cart is implemented as a dialog that can be toggled from the header:

```typescript
function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  return (
    <header>
      {/* ... */}
      <button onClick={() => setIsCartOpen(true)}>
        Cart
      </button>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
```

## Admin Access Control

The admin dashboard is only accessible to admin users. In a production environment, this would be protected by authentication middleware, but in the current implementation, it's based on the user's admin status:

```typescript
// Simplified example
function App() {
  const { isAdmin } = useAuth(); // Not yet implemented fully
  
  return (
    <Router>
      {/* ... */}
      {isAdmin && <Route path="/admin" component={AdminDashboard} />}
      {/* ... */}
    </Router>
  );
}
```

## Frame Design Assistant Navigation

The Frame Design Assistant is accessible from multiple points:

1. Direct access on the test page: `/frame-assistant-test`
2. Integration into the Custom Framing page: `/custom-framing`
3. Available in the chat interface throughout the site

## Mobile Navigation

The application includes responsive navigation that adapts to mobile screens:

```typescript
// Simplified example
function Header() {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <header>
      {/* ... */}
      {isMobile ? (
        <>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? 'Close' : 'Menu'}
          </button>
          {isMobileMenuOpen && (
            <nav className="mobile-navigation">
              {/* Mobile navigation links */}
            </nav>
          )}
        </>
      ) : (
        <nav className="desktop-navigation">
          {/* Desktop navigation links */}
        </nav>
      )}
    </header>
  );
}
```

## Registration of API Routes

API routes are registered in `server/routes.ts` using the Express framework:

```typescript
export async function registerRoutes(app: Express): Promise<Server> {
  // Register product routes
  app.get("/api/products", async (req: Request, res: Response) => {
    // Implementation...
  });
  
  // Register order routes
  app.post("/api/orders", async (req: Request, res: Response) => {
    // Implementation...
  });
  
  // Register AI routes
  app.post("/api/frame-assistant", async (req: Request, res: Response) => {
    // Implementation...
  });
  
  // More routes...
  
  const httpServer = createServer(app);
  return httpServer;
}
```