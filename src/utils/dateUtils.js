import moment from "moment";

export const convertDateToFormat = (date, format = "DD-MM-YYYY") =>
	moment(date).format(format);
