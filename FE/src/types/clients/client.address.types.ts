export interface Province {
    code: string;
    name: string;
    englishName: string;
    administrativeLevel: string;
    decree: string;
}
// Define the structure of the API response
export interface ProvincesResponse {
    requestId: string;
    provinces: Province[];
}

// Define the structure of a Commune
export interface Ward {
    code: string;
    name: string;
    englishName: string;
    administrativeLevel: string;
    provinceCode: string;
    provinceName: string;
    decree: string;
}
export interface WardRequest {
    codeProvince: string
}

// Define the structure of the API response
export interface WardsResponse {
    requestId: string;
    communes: Ward[];
}

// Address Request (Request Payload)
export interface AddressRequest {
    province: string;  // Example: "Long An"
    ward: string;      // Example: "Kien Tuong"
    detail: string;    // Example: "123 Duong so 2"
}

// Address Response (Response Payload)
export interface AddressResponse {
    success: boolean;   // Indicates if the request was successful
    data: {
        user_id: string;  // Example: "fb63f596-c4fb-4819-8e42-e3553651444d"
        addresses: Address[];  // List of addresses associated with the user
    };
}

// Address (Address data within the response)
export interface Address {
    id: number;          // Example: 1
    province: string;    // Example: "Long An"
    ward: string;        // Example: "Kien Tuong"
    detail: string;      // Example: "123 Duong so 2"
}
