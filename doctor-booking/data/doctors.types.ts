export interface Doctor {
    id: number;
    name: string;
    specialization: string;
    experience: string;
    rating: number;
    gender: string;
    imageUrl: string;
    diseases: string[];
  }

  export interface DoctorBackend {
    id: number;
    doctor_name: string;
    specialty: string;
    experience: string;
    rating: number;
    gender: string;
    imageUrl: string;
    diseases: string[];
    photo_url:string
  }

  export interface DoctorExtended{
    id: number;
    name: string;
    specialization: string;
    experience: string;
    rating: number;
    gender: string;
    imageUrl: string;
    diseases: string[];
    location: {
      id : number
      name : string
    }
    appointment_slots : {
      id : number
      date : string
      slot : string
      is_booked : boolean
    }[]
    appointments : { id: number
       user_id: number
      type: string
      date: string
      time: string
      location: string }[]
  }
  
  export interface FilterState {
    rating: string[];
    experience: string[];
    gender: string[];
  }