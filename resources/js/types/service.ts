export type ServiceStatus = 'Active' | 'Inactive';

/** Matches the services table in the data dictionary. */
export interface OfficeService {
  service_id: number;
  office_id: number;
  service_name: string;
  description: string;
  requirements: string;
  processing_time: string;
  status: ServiceStatus;
}
