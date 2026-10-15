import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/utils";
export function WhatsappFloat() { return <a href={whatsappUrl("Bonjour domiStore, j'aimerais en savoir plus sur vos serrures intelligentes.")} target="_blank" rel="noreferrer" aria-label="Contacter domiStore sur WhatsApp" className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-1"><MessageCircle size={19} /> <span className="hidden sm:inline">WhatsApp</span></a>; }
