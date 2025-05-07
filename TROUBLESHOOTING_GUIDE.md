# Troubleshooting Guide for Jay's Frames

This guide provides step-by-step instructions for common issues and how to resolve them.

## Database Schema and Migration Issues

### How to Fix Missing Details Field in Frame Options

If the details field is missing from the frameOptions table or you're getting errors about it:

1. Check the schema definition in `shared/schema.ts`:
   ```typescript
   export const frameOptions = pgTable("frame_options", {
     id: serial("id").primaryKey(),
     name: text("name").notNull(),
     color: text("color").notNull(),
     material: text("material").notNull(),
     pricePerInch: integer("price_per_inch").notNull(),
     imageUrl: text("image_url"),
     width: integer("width").default(25),
     details: jsonb("details"), // Make sure this line exists
   });
   ```

2. If the field is missing, add it and run the database migration:
   ```bash
   npm run db:push
   ```

3. Restart the application:
   ```bash
   npm run dev
   ```

### Re-importing Larson Juhl Catalog

If the Larson Juhl catalog frames are missing or need to be reimported:

1. Make sure the database schema is up-to-date with the details field (see above)

2. Call the import endpoint:
   ```bash
   curl -X POST http://localhost:5000/api/catalog/larson-juhl/import
   ```

3. Verify the import was successful:
   ```bash
   curl -s http://localhost:5000/api/catalog/larson-juhl | jq
   ```

4. Restart the application if necessary:
   ```bash
   npm run dev
   ```

## Frame Designer Interface Issues

### Mat Options Displaying Duplicates

If mat options are showing duplicates in the UI:

1. Open `client/src/components/product/frame-designer.tsx`

2. Make sure the deduplication logic is in place when fetching mat options:
   ```typescript
   // Fetch mat options
   const matResponse = await fetch('/api/mat-options');
   const matData = await matResponse.json() as MatOption[];
   // Remove any duplicates using a map with ID as key
   const uniqueMats = Array.from(
     new Map(matData.map((mat: MatOption) => [mat.id, mat])).values()
   ) as MatOption[];
   setDatabaseMats(uniqueMats);
   ```

### Collection Filtering Not Working

If frame collection filtering isn't working properly:

1. Check the collection grouping implementation in `client/src/components/product/frame-designer.tsx`:
   ```typescript
   // Group frames by collection for better organization
   const framesByCollection = useMemo(() => {
     const grouped: {[key: string]: FrameOption[]} = {};
     
     // Process all database frames
     databaseFrames.forEach(frame => {
       const details = frame.details as any;
       const collection = details?.collection || 'Standard';
       
       if (!grouped[collection]) {
         grouped[collection] = [];
       }
       grouped[collection].push(frame);
     });
     
     return grouped;
   }, [databaseFrames]);
   ```

2. Make sure the collection filter UI is properly implemented:
   ```jsx
   {/* Collection Filter */}
   {availableCollections.length > 0 && (
     <div className="mb-4">
       <div className="text-sm font-medium mb-2 text-neutral-700">Filter by Collection</div>
       <div className="flex flex-wrap gap-2">
         <Button
           variant={selectedCollection === null ? "default" : "outline"}
           size="sm"
           onClick={() => setSelectedCollection(null)}
           className="text-xs"
         >
           All Frames
         </Button>
         {availableCollections.map(collection => (
           <Button
             key={collection}
             variant={selectedCollection === collection ? "default" : "outline"}
             size="sm"
             onClick={() => setSelectedCollection(collection)}
             className="text-xs"
           >
             {collection}
           </Button>
         ))}
       </div>
     </div>
   )}
   ```

3. Check the filteredFrames implementation:
   ```typescript
   // Filter frames by selected collection
   const filteredFrames = useMemo(() => {
     // If no collection selected, return all frames (limited to avoid performance issues)
     if (!selectedCollection) {
       return databaseFrames.slice(0, 100);
     }

     // Return frames from the selected collection
     return framesByCollection[selectedCollection] || [];
   }, [databaseFrames, framesByCollection, selectedCollection]);
   ```

## Type Definition Issues

### Property 'details' Does Not Exist on Type 'FrameOption'

If you're getting TypeScript errors about the details property:

1. Make sure the FrameOption type is properly updated in `shared/schema.ts` to include the details field:
   ```typescript
   // Update the frame options model
   export const frameOptions = pgTable("frame_options", {
     id: serial("id").primaryKey(),
     name: text("name").notNull(),
     color: text("color").notNull(),
     material: text("material").notNull(),
     pricePerInch: integer("price_per_inch").notNull(),
     imageUrl: text("image_url"),
     width: integer("width").default(25),
     details: jsonb("details"),
   });
   ```

2. In components where you're accessing the details property, use a type assertion:
   ```typescript
   const details = frame.details as any;
   const collection = details?.collection || 'Standard';
   ```

3. For a proper fix, update the client-side FrameOption interface:
   ```typescript
   // In client/src/types/index.ts or similar
   export interface FrameOption {
     id: number;
     name: string;
     color: string;
     material: string;
     pricePerInch: number;
     imageUrl?: string;
     width?: number;
     details?: {
       collection?: string;
       style?: string;
       sku?: string;
       description?: string;
       details?: {
         width?: number;
       }
     }
   }
   ```

## API and Data Issues

### Empty Response from Larson Juhl API Endpoints

If the Larson Juhl API endpoints are returning empty arrays:

1. Check if the catalog was imported successfully:
   ```bash
   curl -X POST http://localhost:5000/api/catalog/larson-juhl/import
   ```

2. Verify the frames were added to the database:
   ```bash
   curl -s http://localhost:5000/api/frame-options | jq
   ```

3. Check if the details field is properly populated during import in `server/services/catalog.ts`:
   ```typescript
   const newFrameOptions: InsertFrameOption[] = larsonJuhlCatalog.map(item => ({
     name: `${item.collection} ${item.sku}`,
     color: item.color,
     material: item.material,
     pricePerInch: item.pricePerInch,
     imageUrl: item.imageUrl || "default-url",
     // Make sure details is properly set
     details: {
       collection: item.collection,
       style: item.style,
       sku: item.sku,
       description: item.description,
       details: {
         width: item.width
       }
     }
   }));
   ```

4. Check if the filtering logic in getLarsonJuhlFrames is working correctly:
   ```typescript
   export async function getLarsonJuhlFrames(): Promise<FrameOption[]> {
     const frameOptions = await storage.getFrameOptions();
     
     // Filter frames that belong to Larson Juhl collections
     const larsonJuhlCollections = new Set(larsonJuhlCatalog.map(item => item.collection));
     
     return frameOptions.filter(frame => {
       const details = frame.details as any;
       return details && details.collection && larsonJuhlCollections.has(details.collection);
     });
   }
   ```

## General Debugging Tips

1. Check the database schema and make sure it matches what's expected
2. Verify data is being correctly inserted and retrieved
3. Look for type mismatches or missing fields
4. Check for console errors in the browser
5. Test API endpoints directly using curl or similar tools
6. Restart the application after schema changes
7. Check the development logs for recent changes that might have introduced issues