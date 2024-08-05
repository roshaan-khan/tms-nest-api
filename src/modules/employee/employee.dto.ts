import * as Joi from "joi"
import { Employee } from "src/schemas/employee.schema";
import { eSalaryType } from "src/types/common.enum";

export const employeeSchema = Joi.object<Employee>({
    name: Joi.string().required(),
    phone: Joi.string().required().min(11),
    designation: Joi.string().required(),
    salaryType: Joi.string().required().valid(...Object.values(eSalaryType)),
    salary: Joi.number().required(),
});