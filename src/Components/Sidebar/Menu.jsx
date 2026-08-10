export const SIDEBAR_MENU = [
  {
    name: "Dashboard",
    icon: "bx bxs-dashboard",
    path: "/dashboard"
  },
  {
    name: "Vendor Management",
    icon: "bx bx-store",
    path: "/vendors"
  },
  {
    name: "FAQ management",
    icon: "bx bx-help-circle",
    path: "/faqs"
  },
  {
    name: "Location Management",
    icon: "bx bxs-map",
    subItems: [
      { name: "State", path: "/states" },
      { name: "City", path: "/cities" },
    ]
  },
  {
    name: "Property Management",
    icon: "bx bx-home",
    subItems: [
      { name: "All Properties", path: "/all-properties" },
      { name: "Property Type", path: "/property-type" },
      { name: "Property Amenity", path: "/property-amenity" },
    ]
  },
  {
    name: "Room Management",
    icon: "bx bx-bed",
    subItems: [
      { name: "Room Type", path: "/room-type" },
      { name: "Room Amenity", path: "/room-amenity" },
    ]
  },

  {
    name: "Policy Management",
    icon: "bx bx-file",
    subItems: [
      { name: "Page Management", path: "/page-management" },
      { name: "Cancellation Policy", path: "/cancellation-policy" },
      { name: "Property Rules", path: "/property-rules" },
    ]
  },
  {
    name: "Booking Management",
    icon: "bx bxs-calendar",
    path: "/bookings"
  },
  // {
  //   name: "Reports",
  //   icon: "bx bxs-report",
  //   subItems: [
  //     { name: "Booking Reports", path: "/reports/bookings" },
  //     { name: "Revenue Reports", path: "/reports/revenue" },
  //     { name: "User Reports", path: "/reports/users" }
  //   ]
  // },
  {
    name: "Currency Management",
    icon: "bx bx-dollar-circle",
    path: "/currencies"
  },
  {
    name: "Language Management",
    icon: "bx bx-globe",
    path: "/languages"
  },
  {
    name: "Commission Management",
    icon: "bx bx-trending-up",
    path: "/commissions"
  },
  {
    name: "Blog Management",
    icon: "bx bx-news",
    subItems: [
      { name: "All Blogs", path: "/blogs" },
      { name: "Create Blog", path: "/blogs/create" },
    ]
  },
  {
    name: "Curated Exploration",
    icon: "bx bx-compass",
    path: "/curated-exploration"
  },
  {
    name: "Partners",
    icon: "bx bx-group",
    subItems: [
      { name: "Travel Partner", path: "/travel-partners" },
      { name: "Property Partner", path: "/property-partners" },
    ]
  },
  {
    name: "Payment History",
    icon: "bx bx-credit-card",
    path: "/payment-history"
  },
  {
    name: "User Management",
    icon: "bx bxs-user-account",
    path: "/users"
  },
  {
    name: "Ticket Management",
    icon: "bx bx-support",
    path: "/tickets"
  },
  {
    name: "Ediary",
    icon: "bx bx-book-open",
    path: "/ediary"
  },
  {
    name: "Contact Us",
    icon: "bx bx-envelope",
    path: "/contact-us"
  },

  {
    name: "Notification",
    icon: "bx bx-bell",
    path: "/notifications"
  },
  {
    name: "Reward Pool",
    icon: "bx bx-gift",
    path: "/reward-pool"
  }
];