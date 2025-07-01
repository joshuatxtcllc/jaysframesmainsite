
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Copy } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DiscountCode {
  id: number;
  code: string;
  description: string;
  percentage: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

const DiscountCodesManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    percentage: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    usageLimit: "",
    isActive: true,
    expiresAt: ""
  });

  const { data: discountCodes = [], isLoading } = useQuery({
    queryKey: ["discountCodes"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/discount-codes");
      if (!response.ok) throw new Error("Failed to fetch discount codes");
      return response.json();
    }
  });

  const createDiscountMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/admin/discount-codes", data);
      if (!response.ok) throw new Error("Failed to create discount code");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discountCodes"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Success", description: "Discount code created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create discount code", variant: "destructive" });
    }
  });

  const updateDiscountMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest("PUT", `/api/admin/discount-codes/${id}`, data);
      if (!response.ok) throw new Error("Failed to update discount code");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discountCodes"] });
      setIsDialogOpen(false);
      setEditingDiscount(null);
      resetForm();
      toast({ title: "Success", description: "Discount code updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update discount code", variant: "destructive" });
    }
  });

  const deleteDiscountMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/discount-codes/${id}`);
      if (!response.ok) throw new Error("Failed to delete discount code");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discountCodes"] });
      toast({ title: "Success", description: "Discount code deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete discount code", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      percentage: "",
      minOrderAmount: "",
      maxDiscountAmount: "",
      usageLimit: "",
      isActive: true,
      expiresAt: ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      code: formData.code.toUpperCase(),
      description: formData.description,
      percentage: parseInt(formData.percentage),
      minOrderAmount: formData.minOrderAmount ? parseInt(formData.minOrderAmount) * 100 : null,
      maxDiscountAmount: formData.maxDiscountAmount ? parseInt(formData.maxDiscountAmount) * 100 : null,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
      isActive: formData.isActive,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null
    };

    if (editingDiscount) {
      updateDiscountMutation.mutate({ id: editingDiscount.id, data: submitData });
    } else {
      createDiscountMutation.mutate(submitData);
    }
  };

  const handleEdit = (discount: DiscountCode) => {
    setEditingDiscount(discount);
    setFormData({
      code: discount.code,
      description: discount.description || "",
      percentage: discount.percentage.toString(),
      minOrderAmount: discount.minOrderAmount ? (discount.minOrderAmount / 100).toString() : "",
      maxDiscountAmount: discount.maxDiscountAmount ? (discount.maxDiscountAmount / 100).toString() : "",
      usageLimit: discount.usageLimit?.toString() || "",
      isActive: discount.isActive,
      expiresAt: discount.expiresAt ? discount.expiresAt.split('T')[0] : ""
    });
    setIsDialogOpen(true);
  };

  const copyDiscountCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied", description: "Discount code copied to clipboard" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Discount Codes</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingDiscount(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Discount Code
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingDiscount ? "Edit Discount Code" : "Create Discount Code"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">Discount Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="SAVE10"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="10% off all orders"
                />
              </div>
              
              <div>
                <Label htmlFor="percentage">Discount Percentage</Label>
                <Input
                  id="percentage"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.percentage}
                  onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                  placeholder="10"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="minOrderAmount">Minimum Order Amount ($)</Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  min="0"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                  placeholder="50"
                />
              </div>
              
              <div>
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  min="1"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  placeholder="100"
                />
              </div>
              
              <div>
                <Label htmlFor="expiresAt">Expiration Date</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              
              <Button type="submit" className="w-full">
                {editingDiscount ? "Update" : "Create"} Discount Code
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Discount Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discountCodes.map((discount: DiscountCode) => (
                <TableRow key={discount.id}>
                  <TableCell className="font-mono">
                    <div className="flex items-center gap-2">
                      {discount.code}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyDiscountCode(discount.code)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{discount.description}</TableCell>
                  <TableCell>{discount.percentage}%</TableCell>
                  <TableCell>
                    {discount.usedCount}
                    {discount.usageLimit && ` / ${discount.usageLimit}`}
                  </TableCell>
                  <TableCell>
                    <Badge variant={discount.isActive ? "default" : "secondary"}>
                      {discount.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(discount)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteDiscountMutation.mutate(discount.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscountCodesManager;
