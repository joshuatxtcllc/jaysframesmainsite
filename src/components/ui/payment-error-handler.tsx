
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface PaymentErrorHandlerProps {
  error: string | null;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function PaymentErrorHandler({ error, onRetry, isRetrying }: PaymentErrorHandlerProps) {
  if (!error) return null;

  const getErrorMessage = (error: string) => {
    // Common Stripe error messages
    if (error.includes('card_declined')) {
      return {
        title: "Card Declined",
        description: "Your card was declined. Please try a different payment method or contact your bank."
      };
    }
    
    if (error.includes('insufficient_funds')) {
      return {
        title: "Insufficient Funds",
        description: "Your card does not have sufficient funds. Please try a different payment method."
      };
    }
    
    if (error.includes('expired_card')) {
      return {
        title: "Card Expired",
        description: "Your card has expired. Please use a different payment method."
      };
    }
    
    if (error.includes('incorrect_cvc')) {
      return {
        title: "Incorrect CVC",
        description: "The CVC code you entered is incorrect. Please check and try again."
      };
    }
    
    if (error.includes('processing_error')) {
      return {
        title: "Processing Error",
        description: "There was an error processing your payment. Please try again in a few moments."
      };
    }
    
    // Default error message
    return {
      title: "Payment Error",
      description: error
    };
  };

  const errorDetails = getErrorMessage(error);

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{errorDetails.title}</AlertTitle>
      <AlertDescription className="mt-2">
        {errorDetails.description}
        <div className="mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            disabled={isRetrying}
            className="flex items-center space-x-2"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span>Retrying...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-3 w-3" />
                <span>Try Again</span>
              </>
            )}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
