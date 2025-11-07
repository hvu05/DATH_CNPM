import React from 'react';
import './index.scss';

interface ChangeAddressProps {
    setFormChangeAddress: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChangeAddressPage: React.FC<ChangeAddressProps> = ({ setFormChangeAddress }) => {
    return (
        <div className="change-address-container">
            <div className="bgr-opacity"></div>
            <div className="change-address">
                <h1>Chọn địa chỉ giao hàng</h1>
                <ul>
                    <li>
                        <div className="flex">
                            <div className="flex items-center h-5">
                                <input
                                    id="helper-checkbox"
                                    aria-describedby="helper-checkbox-text"
                                    type="checkbox"
                                    value=""
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>
                            <div className="ms-2 text-sm">
                                <label
                                    htmlFor="helper-checkbox"
                                    className="font-medium text-gray-900 dark:text-gray-300"
                                >
                                    Lam Hoang Vu
                                </label>
                                <p
                                    id="helper-checkbox-text"
                                    className="text-xs font-normal text-gray-500 dark:text-gray-300"
                                >
                                    Số 123 Đường ABC, Khu phố A, Tỉnh ABC
                                </p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="flex">
                            <div className="flex items-center h-5">
                                <input
                                    id="helper-checkbox"
                                    aria-describedby="helper-checkbox-text"
                                    type="checkbox"
                                    value=""
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>
                            <div className="ms-2 text-sm">
                                <label
                                    htmlFor="helper-checkbox"
                                    className="font-medium text-gray-900 dark:text-gray-300"
                                >
                                    Lam Hoang Vu
                                </label>
                                <p
                                    id="helper-checkbox-text"
                                    className="text-xs font-normal text-gray-500 dark:text-gray-300"
                                >
                                    Số 123 Đường ABC, Khu phố A, Tỉnh ABC
                                </p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="flex">
                            <div className="flex items-center h-5">
                                <input
                                    id="helper-checkbox"
                                    aria-describedby="helper-checkbox-text"
                                    type="checkbox"
                                    value=""
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>
                            <div className="ms-2 text-sm">
                                <label
                                    htmlFor="helper-checkbox"
                                    className="font-medium text-gray-900 dark:text-gray-300"
                                >
                                    Lam Hoang Vu
                                </label>
                                <p
                                    id="helper-checkbox-text"
                                    className="text-xs font-normal text-gray-500 dark:text-gray-300"
                                >
                                    Số 123 Đường ABC, Khu phố A, Tỉnh ABC
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>

                <div className="btn-rebuy change-address__btn-save">Lưu địa chỉ</div>
                <div
                    className="btn-processing change-address__btn-cancel"
                    onClick={() => setFormChangeAddress(false)}
                >
                    Hủy
                </div>
            </div>
        </div>
    );
};
