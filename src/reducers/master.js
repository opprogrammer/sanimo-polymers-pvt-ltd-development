import {
	ADD_MASTER_LIST,
	EDIT_MASTER_LIST,
	GET_MASTER_DETAILS,
	GET_MASTER_LIST,
	IMPORT_MASTER,
	RESET_MASTER_DETAILS,
} from "constants/master";

const initialState = {
	isFetchingMasterList: false,
	isUpdatingMasterList: false,
	isFetchingMasterDetails: false,
	isUpdatingMasterDetails: false,
	isFetchingDropdownList: false,
	// company
	companyMasterList: [],
	companyPagination: {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// party
	partyMasterList: [],
	partyPagination: {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// transport
	transportMasterList: [],
	transportPagination: {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// department
	departmentMasterList: [],
	departmentPagination: {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// location
	locationMasterList: [],
	locationPagination: {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// financial
	"financial-yearMasterList": [],
	"financial-yearPagination": {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// process
	processMasterList: [],
	processPagination: {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// denier
	denierMasterList: [],
	denierPagination: {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// filament
	filamentMasterList: [],
	filamentPagination: {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// count
	countMasterList: [],
	countPagination: {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// shade
	shadeMasterList: [],
	shadePagination: {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// lot
	lotMasterList: [],
	lotPagination: {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// yarn quality
	"yarn-qualityMasterList": [],
	"yarn-qualityPagination": {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// common
	"yarn-qualityDropdownList": [],
	partyDropdownList: [],
	shadeDropdownList: [],
	isImportingMaster: false,

	// raw material
	// grn
	"grnMasterDetails":[],
	"grnMasterList": [],
	"grnPagination": {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// repacking
	"repackingMasterList": [],
	"repackingMasterDetails":[],
	"repackingPagination": {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// wip
	"wipMasterDetails":[],
	"wipMasterList": [],
	"wipPagination": {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// issue-to-department
	"issue-to-departmentMasterList": [],
	"issue-to-departmentPagination": {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// outward
	outwardMasterList: [],
	outwardPagination: {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// stock
	stockMasterList: [],
	stockPagination: {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	// quality-check
	"quality-checkMasterList": [],
	"quality-checkMasterDetails": [],
	"quality-checkPagination": {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
	palletMasterList: [],
	palletPagination: {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},

	// sale order
	"sale-orderMasterList": [],
	"sale-orderMasterDetails": {},
	"sale-orderPagination": {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},

	// dyeing planning
	"dyeing-planningMasterList": [],
	"dyeing-planningMasterDetails": {},
	"dyeing-planningPagination": {
		pageSize: 10,
		totalElements: 10,
		currentPage: 1,
	},
};

export const getIsUpdatingMasterList = state => {
	return state?.masterDetails?.isUpdatingMasterList;
};

export const getIsFetchingMasterList = state => {
	return state?.masterDetails?.isFetchingMasterList;
};

export const getIsFetchingMasterDetails = state => {
	return state?.masterDetails?.isFetchingMasterDetails;
};

export const getIsFetchingDropdownList = state => {
	return state?.masterDetails?.isFetchingDropdownList;
};

//company
export const getCompanyMasterList = state => {
	return state?.masterDetails?.companyMasterList;
};

export const getCompanyPagination = state => {
	return state?.masterDetails?.companyPagination;
};

//party
export const getPartyMasterList = state => {
	return state?.masterDetails?.partyMasterList;
};

export const getPartyPagination = state => {
	return state?.masterDetails?.partyPagination;
};

//transport
export const getTransportMasterList = state => {
	return state?.masterDetails?.transportMasterList;
};

export const getTransportPagination = state => {
	return state?.masterDetails?.transportPagination;
};

//department
export const getDepartmentMasterList = state => {
	return state?.masterDetails?.departmentMasterList;
};

export const getDepartmentPagination = state => {
	return state?.masterDetails?.departmentPagination;
};

// location
export const getLocationMasterList = state => {
	return state?.masterDetails?.locationMasterList;
};

export const getLocationPagination = state => {
	return state?.masterDetails?.locationPagination;
};

//process
export const getProcessMasterList = state => {
	return state?.masterDetails?.processMasterList;
};

export const getProcessPagination = state => {
	return state?.masterDetails?.processPagination;
};

//denier
export const getDenierMasterList = state => {
	return state?.masterDetails?.denierMasterList;
};

export const getDenierPagination = state => {
	return state?.masterDetails?.denierPagination;
};

//filament
export const getFilamentMasterList = state => {
	return state?.masterDetails?.filamentMasterList;
};

export const getFilamentPagination = state => {
	return state?.masterDetails?.filamentPagination;
};

//count
export const getCountMasterList = state => {
	return state?.masterDetails?.countMasterList;
};

export const getCountPagination = state => {
	return state?.masterDetails?.countPagination;
};

//shade
export const getShadeMasterList = state => {
	return state?.masterDetails?.shadeMasterList;
};

export const getShadePagination = state => {
	return state?.masterDetails?.shadePagination;
};

//lot
export const getLotMasterList = state => {
	return state?.masterDetails?.lotMasterList;
};

export const getLotPagination = state => {
	return state?.masterDetails?.lotPagination;
};

// financialYear
export const getFinancialYearMasterList = state => {
	return state?.masterDetails?.["financial-yearMasterList"];
};

export const getFinancialYearPagination = state => {
	return state?.masterDetails?.["financial-yearPagination"];
};

//yarnQuality
export const getYarnQualityMasterList = state => {
	return state?.masterDetails?.["yarn-qualityMasterList"];
};

export const getYarnQualityPagination = state => {
	return state?.masterDetails?.["yarn-qualityPagination"];
};

// import
export const getIsImportingMaster = state => {
	return state?.masterDetails?.isImportingMaster;
};

// common
export const getYarnQualityDropdownList = state => {
	return state?.masterDetails?.["yarn-qualityDropdownList"];
};

export const getPartyDropdownList = state => {
	return state?.masterDetails?.partyDropdownList;
};

export const getShadeDropdownList = state => {
	return state?.masterDetails?.shadeDropdownList;
};

// grn
export const getGrnMasterList = state => {
	return state?.masterDetails?.["grnMasterList"];
};

export const getGrnMasterDetails = state => {
	return state?.masterDetails?.["grnMasterDetails"];
};

export const getGrnPagination = state => {
	return state?.masterDetails?.["grnPagination"];
};



// repacking
export const getRepackingMasterList = state => {
	return state?.masterDetails?.["repackingMasterList"];
};

export const getRepackingMasterDetails = state => {
	return state?.masterDetails?.["repackingMasterDetails"];
};

export const getRepackingPagination = state => {
	return state?.masterDetails?.["repackingPagination"];
};

// wip
export const getWipMasterList = state => {
	return state?.masterDetails?.["wipMasterList"];
};

export const getWipMasterDetails = state => {
	return state?.masterDetails?.["wipMasterDetails"];
};

export const getWipPagination = state => {
	return state?.masterDetails?.["wipPagination"];
};

//qualityCheck
export const getQualityCheckMasterList = state => {
	return state?.masterDetails?.["quality-checkMasterList"];
};

export const getQualityCheckMasterDetails = state => {
	return state?.masterDetails?.["quality-checkMasterDetails"];
};


export const getQualityCheckPagination = state => {
	return state?.masterDetails?.["quality-checkPagination"];
};

//issueToDepartment
export const getIssueToDepartmentMasterList = state => {
	return state?.masterDetails?.["issue-to-departmentMasterList"];
};

export const getIssueToDepartmentPagination = state => {
	return state?.masterDetails?.["issue-to-departmentPagination"];
};

//outward
export const getOutwardMasterList = state => {
	return state?.masterDetails?.["outwardMasterList"];
};

export const getOutwardPagination = state => {
	return state?.masterDetails?.["outwardPagination"];
};

// stock
export const getStockMasterList = state => {
	return state?.masterDetails?.stockMasterList;
};

export const getStockPagination = state => {
	return state?.masterDetails?.stockPagination;
};

// pallet
export const getPalletMasterList = state => {
	return state?.masterDetails?.palletMasterList;
};

export const getPalletPagination = state => {
	return state?.masterDetails?.palletPagination;
};

// sale order
export const getSaleOrderMasterList = state => {
	return state?.masterDetails?.["sale-orderMasterList"];
};

export const getSaleOrderMasterDetails = state => {
	return state?.masterDetails?.["sale-orderMasterDetails"];
};

export const getSaleOrderPagination = state => {
	return state?.masterDetails?.["sale-orderPagination"];
};

// dyeing planning
export const getDyeingPlanningMasterList = state => {
	return state?.masterDetails?.["dyeing-planningMasterList"];
};

export const getDyeingPlanningMasterDetails = state => {
	return state?.masterDetails?.["dyeing-planningMasterDetails"];
};

export const getDyeingPlanningPagination = state => {
	return state?.masterDetails?.["dyeing-planningPagination"];
};

export const masterReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case GET_MASTER_LIST.REQUEST:
			return { ...state, isFetchingMasterList: true };
		case GET_MASTER_LIST.SUCCESS:
			const {
				data: { data },
				query,
				masterName,
			} = payload;
			return {
				...state,
				isFetchingMasterList: false,
				[`${masterName}MasterList`]: data?.results,
				[`${masterName}Pagination`]: {
					currentPage: query?.page,
					pageSize: query?.page_size,
					totalElements: data?.count,
				},
			};
		case GET_MASTER_LIST.FAILURE:
			return { ...state, isFetchingMasterList: false };

		case GET_MASTER_DETAILS.REQUEST:
			return { ...state, isFetchingMasterDetails: true };
		case GET_MASTER_DETAILS.SUCCESS:
			return {
				...state,
				isFetchingMasterDetails: false,
				[`${payload?.masterName}MasterDetails`]: payload?.data?.data,
			};
		case GET_MASTER_DETAILS.FAILURE:
			return { ...state, isFetchingMasterDetails: false };

		case RESET_MASTER_DETAILS:
			return { ...state, [`${payload?.masterName}MasterDetails`]: {} };

		case EDIT_MASTER_LIST.REQUEST:
		case ADD_MASTER_LIST.REQUEST:
			return { ...state, isUpdatingMasterList: true };
		case ADD_MASTER_LIST.SUCCESS:
		case EDIT_MASTER_LIST.SUCCESS:
		case ADD_MASTER_LIST.FAILURE:
		case EDIT_MASTER_LIST.FAILURE:
			return {
				...state,
				isUpdatingMasterList: false,
			};

		case IMPORT_MASTER.REQUEST:
			return { ...state, isImportingMaster: true };
		case IMPORT_MASTER.SUCCESS:
			return {
				...state,
				isImportingMaster: false,
			};
		case IMPORT_MASTER.FAILURE:
			return { ...state, isImportingMaster: false };

		default:
			return state;
	}
};
