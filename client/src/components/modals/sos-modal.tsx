import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, Users } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient"; // Ensure this is set up to handle your API requests

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SOSModal({ isOpen, onClose }: SOSModalProps) {
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const sendSmsMutation = useMutation({
    mutationFn: async (number: string) => {
      console.log("Sending SMS to:", number); // Debugging log
      const response = await apiRequest("POST", "/api/send-sms", { number });
      return response.json();
    },
    onSuccess: (data) => {
      console.log("SMS sent successfully:", data); // Debugging log
      setIsSending(false);
      alert("SMS sent successfully!");
      onClose(); // Close the modal after sending
    },
    onError: (error) => {
      console.error("Error sending SMS:", error); // Debugging log
      setIsSending(false);
      alert("Failed to send SMS. Please try again.");
    },
  });

  const handleSendSms = () => {
    if (mobileNumber) {
      setIsSending(true);
      sendSmsMutation.mutate(`+91${mobileNumber}`); // Prepend country code
    } else {
      alert("Please enter a valid mobile number."); // Alert for empty input
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="bg-red-500 -mt-6 -mx-6 pt-6 pb-6 px-6 text-center rounded-t-lg">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-500 h-8 w-8" />
          </div>
          <DialogTitle className="text-xl font-bold text-white mb-2">Emergency Support</DialogTitle>
          <p className="text-white/90">Please enter your mobile number for assistance:</p>
        </div>

        <div className="space-y-4 my-4">
          <input
            type="tel"
            placeholder="Enter your mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="w-full p-2 border rounded"
            maxLength={10} // Assuming Indian mobile numbers
          />
          <Button
            variant="destructive"
            className="w-full py-6 text-base"
            onClick={handleSendSms}
            disabled={isSending}
          >
            {isSending ? "Sending..." : <><Phone className="mr-2 h-5 w-5" /> Send SMS</>}
          </Button>

          <Button
            variant="outline"
            className="w-full py-6 text-base"
            onClick={() => {
              window.open('https://telemanas.mohfw.gov.in/home', '_blank');
            }}
          >
            <Users className="mr-2 h-5 w-5" />
            <span>Contact Your Support Network</span>
          </Button>
        </div>

        <DialogFooter className="flex justify-center border-t border-neutral-100 pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-neutral-600 hover:text-neutral-800"
          >
            I'm okay for now, go back
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}