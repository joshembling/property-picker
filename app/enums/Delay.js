/**
 * @typedef {Object} Delay
 * @property {number} CHECK_URL_RIGHTMOVE - Delay in milliseconds for checking the next Rightmove URL.
 * @property {number} CHECK_URL_ZOOPLA - Delay in milliseconds for checking the next Zoopla URL.
 * @property {number} CREATE_FILTERS - Delay in milliseconds for creating affordability filters.
 * @property {number} LOAD_FILTER_FUNCTIONALITY - Delay in milliseconds for loading filter functionality.
 * @property {number} LOAD_LISTINGS - Delay in milliseconds for loading listings.
 */
const Delay = {
	CHECK_URL_RIGHTMOVE: 300,
	CHECK_URL_ZOOPLA: 1000,
	CREATE_FILTERS: 500,
	LOAD_FILTER_FUNCTIONALITY: 600,
	LOAD_LISTINGS: 500,
}

export default Delay;