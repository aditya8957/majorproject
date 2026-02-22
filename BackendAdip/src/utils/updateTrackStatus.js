const TrackStatus = require('../models/trackStatus');

/**
 * Update track status when beneficiary is updated
 * @param {string} applicationId - The application ID
 * @param {Object} updateData - The data to update
 * @param {string} updateData.status - New status
 * @param {string} updateData.center - Center name (optional)
 */
const updateTrackStatus = async (applicationId, updateData) => {
  try {
    const result = await TrackStatus.findOneAndUpdate(
      { applicationId },
      {
        $set: {
          status: updateData.status,
          center: updateData.center || '',
          updatedDate: new Date()
        }
      },
      { 
        new: true,
        upsert: true // Create if doesn't exist
      }
    );

    console.log(`✅ Track status updated for ${applicationId}: ${updateData.status}`);
    return result;

  } catch (error) {
    console.error(`❌ Error updating track status for ${applicationId}:`, error);
    throw error;
  }
};

module.exports = updateTrackStatus;