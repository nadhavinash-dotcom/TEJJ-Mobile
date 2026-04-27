import { 
  X, 
  Zap, 
  UtensilsCrossed, 
  Wine, 
  Utensils, 
  BrushCleaning, 
  Home, 
  Briefcase, 
  ClipboardCheck, 
  UserCircle,
  Menu,
  TrendingUp,
  ChefHat,
  Clock,
  UserCheck,
  ArrowRight,
  PartyPopper,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  Users,
  Plus,
  FilePlus,
  ArrowLeft,
  Share,
  ShieldCheck,
  CheckCircle,
  Footprints,
  Bookmark,
  Timer,
  Bell,
  ChevronRight,
  BarChart2,
  Wallet,
  Settings,
  LogOut
} from 'lucide-react-native';
import { cssInterop } from 'nativewind';

function interopIcon(icon: any) {
  if (icon) {
    cssInterop(icon, {
      className: {
        target: 'style',
        nativeStyleToProp: {
          color: true,
          opacity: true,
        },
      },
    });
  }
  return icon;
}

export const StyledX = interopIcon(X);
export const StyledZap = interopIcon(Zap);
export const StyledUtensilsCrossed = interopIcon(UtensilsCrossed);
export const StyledWine = interopIcon(Wine);
export const StyledUtensils = interopIcon(Utensils);
export const StyledBrushCleaning = interopIcon(BrushCleaning);
export const StyledHome = interopIcon(Home);
export const StyledBriefcase = interopIcon(Briefcase);
export const StyledClipboardCheck = interopIcon(ClipboardCheck);
export const StyledUserCircle = interopIcon(UserCircle);
export const StyledMenu = interopIcon(Menu);
export const StyledTrendingUp = interopIcon(TrendingUp);
export const StyledChefHat = interopIcon(ChefHat);
export const StyledClock = interopIcon(Clock);
export const StyledUserCheck = interopIcon(UserCheck);
export const StyledArrowRight = interopIcon(ArrowRight);
export const StyledPartyPopper = interopIcon(PartyPopper);
export const StyledAlertTriangle = interopIcon(AlertTriangle);
export const StyledMapPin = interopIcon(MapPin);
export const StyledCheckCircle2 = interopIcon(CheckCircle2);
export const StyledUsers = interopIcon(Users);
export const StyledPlus = interopIcon(Plus);
export const StyledFilePlus = interopIcon(FilePlus);
export const StyledArrowLeft = interopIcon(ArrowLeft);
export const StyledShare = interopIcon(Share);
export const StyledShieldCheck = interopIcon(ShieldCheck);
export const StyledCheckCircle = interopIcon(CheckCircle);
export const StyledFootprints = interopIcon(Footprints);
export const StyledBookmark = interopIcon(Bookmark);
export const StyledTimer = interopIcon(Timer);
export const StyledBell = interopIcon(Bell);
export const StyledChevronRight = interopIcon(ChevronRight);
export const StyledBarChart2 = interopIcon(BarChart2);
export const StyledWallet = interopIcon(Wallet);
export const StyledSettings = interopIcon(Settings);
export const StyledLogOut = interopIcon(LogOut);
