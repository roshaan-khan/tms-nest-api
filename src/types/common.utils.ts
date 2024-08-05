import { eClothType } from "./common.enum";

export const AVG_CLOTH_DEDUCTION_AMOUNT = {
    [eClothType.KAMEEZ_AND_SHALWAR]: 4.5,
    [eClothType.SHIRT_AND_PANT]: 1.5 + 1.75, // 1.5 for shirt and 1.75 for pant
    [eClothType.COAT]: 3.5,
    [eClothType.WAIST_COAT]: 4,
}