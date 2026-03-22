import { MessageCircle, Phone, ChevronRight } from "lucide-react";

interface WhatsAppButtonProps {
  sellerPhone?: string;
  sellerName?: string;
  productName?: string;
  message?: string;
  variant?: "button" | "floating" | "inline";
  size?: "sm" | "md" | "lg";
}

export function WhatsAppButton({
  sellerPhone = "447700900000",
  sellerName = "the seller",
  productName,
  message,
  variant = "button",
  size = "md",
}: WhatsAppButtonProps) {
  const defaultMessage = productName
    ? `As-salamu alaykum! I'm interested in "${productName}" on Noor Marketplace. Could you please provide more details? JazakAllah Khair.`
    : `As-salamu alaykum! I found your listing on Noor Marketplace and would like to enquire. JazakAllah Khair.`;

  const finalMessage = message ?? defaultMessage;
  const whatsappUrl = `https://wa.me/${sellerPhone}?text=${encodeURIComponent(finalMessage)}`;

  const sizeClasses = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-6 py-3 gap-2.5",
  };

  const iconSizes = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-5 h-5" };

  if (variant === "floating") {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-600 transition-all hover:shadow-xl"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:block">Chat on WhatsApp</span>
      </a>
    );
  }

  if (variant === "inline") {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        Message on WhatsApp
        <ChevronRight className="w-3.5 h-3.5" />
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors ${sizeClasses[size]}`}
    >
      <MessageCircle className={iconSizes[size]} />
      WhatsApp Seller
    </a>
  );
}

interface WhatsAppSupportProps {
  className?: string;
}

export function WhatsAppSupport({ className = "" }: WhatsAppSupportProps) {
  const supportMessage = "As-salamu alaykum! I need help with my Noor Marketplace order. Could you please assist me?";
  const supportUrl = `https://wa.me/447700900000?text=${encodeURIComponent(supportMessage)}`;

  return (
    <div className={`bg-green-50 border border-green-200 rounded-xl p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-green-900 text-sm">Need Help? Chat on WhatsApp</p>
          <p className="text-xs text-green-700">Our team responds within 1 hour, 9am–9pm GMT</p>
        </div>
        <a
          href={supportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-green-500 text-white text-sm px-4 py-2 rounded-full hover:bg-green-600 transition-colors whitespace-nowrap"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Chat Now
        </a>
      </div>
    </div>
  );
}

export default WhatsAppButton;
