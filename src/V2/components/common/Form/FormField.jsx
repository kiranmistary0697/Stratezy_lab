import React from 'react';
const FormField = ({ id, label, type = "text", register, errors, validation }) => {
    return (
        <div className="flex-1">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                id={id}
                type={type}
                {...register(id, validation)}
                className={`mt-1 h-[46px] w-full border ${errors[id] ? "border-red-500" : "border-gray-300"
                    } rounded-md p-[13px]`}
            />
            {errors[id] && <span className="text-red-500 text-sm">{errors[id].message}</span>}
        </div>
    );
};

export default FormField;
