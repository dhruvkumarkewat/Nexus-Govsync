import {
  Landmark, HeartHandshake, GraduationCap, Building2, Bus, Stethoscope,
  ShieldCheck, Clock, Copy, AlertTriangle, Footprints, Files, Hourglass, CircleHelp,
  Plug, BrainCircuit, Shield, ArrowLeftRight, Workflow, BadgeCheck, User, FileCheck,
  Database, Gavel, UserCheck, KeyRound, Fingerprint, Lock, Eye, Timer, Users,
  TrendingDown, Play, ArrowRight, Sun, Moon, X, Check, Menu, ChevronRight, Sparkles,
  Activity, Server, Bell, Search, Settings, Loader2, CircleCheck, ExternalLink, Mail,
  ArrowUpRight, Network, Cpu, Layers, Zap, ScanLine, Route,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Landmark, HeartHandshake, GraduationCap, Building2, Bus, Stethoscope,
  ShieldCheck, Clock, Copy, AlertTriangle, Footprints, Files, Hourglass, CircleHelp,
  Plug, BrainCircuit, Shield, ArrowLeftRight, Workflow, BadgeCheck, User, FileCheck,
  Database, Gavel, UserCheck, KeyRound, Fingerprint, Lock, Eye, Timer, Users,
  TrendingDown, Play, ArrowRight, Sun, Moon, X, Check, Menu, ChevronRight, Sparkles,
  Activity, Server, Bell, Search, Settings, Loader2, CircleCheck, ExternalLink, Mail,
  ArrowUpRight, Network, Cpu, Layers, Zap, ScanLine, Route,
};

export function getIcon(name: string) {
  return iconMap[name] || CircleHelp;
}
