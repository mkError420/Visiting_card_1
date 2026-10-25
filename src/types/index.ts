export type AlumniRelation = 
  | 'নিজে' 
  | 'সহধর্মিনী' 
  | 'সন্তান' 
  | 'পরিবারের সদস্য' 
  | 'অতিথি' 
  | 'গাড়ির চালক';

export interface Participant {
  id: string;
  regNo: number; // e.g. 33 -> "০৩৩"
  name: string;
  school: string;
  address: string;
  relation: AlumniRelation;
  photoUrl: string;
  phone?: string;
  bloodGroup?: string;
  createdAt: string;
}

export interface EventConfig {
  title: string;
  subtitle: string;
  slogan: string;
  date: string;
  venue: string;
  organizer: string;
}
