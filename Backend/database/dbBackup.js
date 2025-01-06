import  DropBox  from "dropbox";
import schedule from  'node-schedule'
import { spawn } from 'child_process';



// create mongo dump
const MONGO_URI = process.env.MONGO_DB_URL; // MongoDB URI
const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN;

const backUpAndUploadToDrpBox = async () => {
  const dumpFileName = `backup_${new Date().toISOString().split("T")[0]}.gz`;
  const dropboxPath = `/Ron Backup/${dumpFileName}`; // Ensure leading slash

  console.log(`Starting backup job for file : ${dumpFileName}`);

  try {
    const dbx = new DropBox.Dropbox({ accessToken: DROPBOX_ACCESS_TOKEN });

    const mongodump = spawn("mongodump", [
      `--uri=${MONGO_URI}`,
      "--archive",
      "--gzip", // Compress the archive
    ]);

    // Upload the mongodump output directly to Dropbox
    const uploadPromise = new Promise((resolve, reject) => {
        let uploadStream = dbx.filesUpload({
          path: dropboxPath,
          contents: mongodump.stdout
        });
  
        mongodump.on('error', (error) => {
          console.error('Error running mongodump:', error);
          reject(error);
        });
  
        uploadStream
          .then((response) => {
            console.log('Backup uploaded to Dropbox:', response.result.path_display);
            resolve();
          })
          .catch((error) => {
            console.error('Error uploading to Dropbox:', error);
            reject(error);
          });
      });
  
      await uploadPromise;
  
      console.log(`Backup job completed successfully for file: ${dumpFileName}`);

  } catch (error) {
    console.error('Backup job failed:', error);
  }
};

// Schedule the backup job to run at midnight daily
const scheduleBackupJob = () => {
    schedule.scheduleJob('0 0 * * *', backUpAndUploadToDrpBox);
    console.log('Backup job scheduled to run at midnight daily.');
  };

export { scheduleBackupJob };

// upload to dropbox
