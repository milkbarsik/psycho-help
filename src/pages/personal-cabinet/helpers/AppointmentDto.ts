import { TAppointment } from "../storeOfAppointment/appointment";
import { combineDateAndTime } from "./dateFunctions";


export default class AppointmentDto {
	patient_id: string;
	therapist_id: string;
	type: string;
	reason: string;
	venue: string;
	remind_time: string;

	constructor (appointment: TAppointment, userId: string | undefined) {
		this.patient_id = userId ? userId : '';
		this.therapist_id = appointment.therapist_id;
		this.type = appointment.type;
		this.reason = appointment.reason;
		this.venue = appointment.venue;
		this.remind_time = combineDateAndTime(appointment.date, appointment.time)
	}
}