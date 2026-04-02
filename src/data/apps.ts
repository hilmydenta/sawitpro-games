export interface AppData {
  name: string;
  role: string;
  icon: string;
  url: string;
}

export const apps: AppData[] = [
  {
    name: "PetaniPRO",
    role: "Untuk Petani",
    icon: "/images/petanipro-icon.png",
    url: "https://play.google.com/store/apps/details?id=com.sawitpro.petaniapp&hl=id",
  },
  {
    name: "AgenPRO",
    role: "Untuk Agen",
    icon: "/images/agenpro-icon.png",
    url: "https://play.google.com/store/apps/details?id=com.sawitpro.memberapp&hl=id",
  },
  {
    name: "KUDPRO",
    role: "Koperasi & KUD Sawit",
    icon: "/images/kudpro-icon.png",
    url: "https://play.google.com/store/apps/details?id=com.sawitpro.cooperativeapp&hl=id",
  },
  {
    name: "KebunPRO",
    role: "Manajemen Kebun Sawit",
    icon: "/images/kebunpro-icon.png",
    url: "https://play.google.com/store/apps/details?id=com.sawitpro.estateapp&hl=id",
  },
];
