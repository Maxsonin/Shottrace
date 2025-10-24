import "axios";

declare module "axios" {
	export interface InternalAxiosRequestConfig {
		// Custom property to prevent same request from retrying infinitely
		_retry?: boolean;
	}
}
