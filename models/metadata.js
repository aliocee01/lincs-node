const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const config = require('../config/database')

const Schema = mongoose.Schema;

const metadataSchema = new Schema({
    "SM_Center_Compound_ID" : String,
    "SM_Dose" : String,
    "SM_Dose_Unit" : String,
    "SM_LINCS_ID" : String,
    "SM_Name" : String,
    "SM_Pert_Type" : String,
    "SM_Time" : String,
    "SM_Time_Unit" : String,
    "det_plate" : String,
    "det_well" : String,
    "id" : String,
    "CL_Name" : String
});

metadataSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Metadata', metadataSchema, 'metadata')
