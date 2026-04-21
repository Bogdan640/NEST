import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "resident" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  apartment: string;
  status: "pending" | "approved";
  headline?: string;
  about?: string;
  phone?: string;
  phonePublic?: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  image?: string;
}

export interface Event {
  id: string;
  title: string;
  type: "MEETING" | "SOCIAL" | "MAINTENANCE" | "OTHER";
  date: string;
  location: string;
  attendees: string[];
  maxCapacity?: number;
  creatorId: string;
  creatorName: string;
  visibility: "ALL" | "BUILDING" | "FLOOR";
}

export interface Resource {
  id: string;
  name: string;
  type: "TOOL" | "BOOK" | "OTHER";
  description: string;
  ownerId: string;
  ownerName: string;
  status: "AVAILABLE" | "BORROWED" | "COOLDOWN";
  borrowerId?: string;
}

export interface ParkingSlot {
  id: string;
  identifier: string;
  ownerId: string;
  availableDates: string;
  applications: string[];
  status: "available" | "filled";
}

interface AppState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  events: Event[];
  setEvents: (events: Event[]) => void;
  resources: Resource[];
  setResources: (resources: Resource[]) => void;
  parking: ParkingSlot[];
  setParking: (parking: ParkingSlot[]) => void;
}

const mockUsers: User[] = [
  { id: "1", name: "Alice Green", email: "alice@nest.com", avatar: "https://i.pravatar.cc/150?u=1", role: "admin", apartment: "4A", status: "approved" },
  { id: "2", name: "Bob Tree", email: "bob@nest.com", avatar: "https://i.pravatar.cc/150?u=2", role: "resident", apartment: "2B", status: "approved" },
];

const mockPosts: Post[] = [
  { id: "1", authorId: "1", authorName: "Alice Green", authorAvatar: "https://i.pravatar.cc/150?u=1", content: "Hey neighbors! We are organizing a spring cleaning this weekend. Let me know if you want to join!", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: "2", authorId: "2", authorName: "Bob Tree", authorAvatar: "https://i.pravatar.cc/150?u=2", content: "Did anyone lose a set of keys in the lobby? I left them with the concierge.", timestamp: new Date(Date.now() - 86400000).toISOString() },
];

const mockEvents: Event[] = [
  { id: "1", title: "Spring Cleaning", type: "MAINTENANCE", date: new Date(Date.now() + 86400000 * 2).toISOString(), location: "Courtyard", attendees: ["1", "2"], maxCapacity: 15, creatorId: "1", creatorName: "Alice Green", visibility: "ALL" },
  { id: "2", title: "Board Game Night", type: "SOCIAL", date: new Date(Date.now() + 86400000 * 5).toISOString(), location: "Common Room", attendees: ["2"], creatorId: "2", creatorName: "Bob Tree", visibility: "BUILDING" },
];

const mockResources: Resource[] = [
  { id: "1", name: "Power Drill", type: "TOOL", description: "Makita 18V with basic drill bits.", ownerId: "community", ownerName: "Community", status: "AVAILABLE" },
  { id: "2", name: "Wheelbarrow", type: "TOOL", description: "Useful for gardening.", ownerId: "1", ownerName: "Alice Green", status: "BORROWED", borrowerId: "2" },
];

const mockParking: ParkingSlot[] = [
  { id: "1", identifier: "Spot 42", ownerId: "2", availableDates: "Oct 10 - Oct 14", applications: ["1"], status: "available" },
];

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [parking, setParking] = useState<ParkingSlot[]>(mockParking);

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser, posts, setPosts, events, setEvents, resources, setResources, parking, setParking }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
}