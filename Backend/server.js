
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});



app.use(cors());


app.use(bodyParser.json());



/////////////////////////////////////////////////////log in api///////////////////////////////////////////////////////////////////////////////////////
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      // 'SELECT Username, Role, AllowedPlants FROM Users WHERE LOWER(Username) = LOWER($1) AND Password = $2',
      'SELECT "username", "role", "allowedplants" FROM "users" WHERE LOWER("username") = LOWER($1) AND "password" = $2 AND ("isdelete" = 0 OR "isdelete" IS NULL)',
      [username, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({
        success: true,
        message: "Login successful",
        role: user.role,
        username: user.username,
        allowedPlants: user.allowedplants
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});////////////////done login api working fine


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





/////////////////////////////////////////////////////////////////////////////////plant master api///////////////////////////////////////////////////////////////////////////////////////////////////////
 app.get('/api/plants', async (req, res) => {
  const userId = req.headers['userid'];
  const role = req.headers['role'] || 'admin';

  try {
    if (role.toLowerCase() === 'admin') {
      const result = await pool.query('SELECT plantid, plantname FROM plantmaster WHERE isdeleted = 0');
      return res.json(result.rows);
    }

    const userResult = await pool.query('SELECT allowedplants FROM users WHERE userid = $1', [userId]);
    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const allowedPlants = userResult.rows[0].allowedplants;
    if (!allowedPlants || allowedPlants.trim() === '') {
      return res.json([]);
    }

    const plantIdArray = allowedPlants.split(',').map(id => parseInt(id.trim())).filter(Boolean);
    const placeholders = plantIdArray.map((_, i) => `$${i + 1}`).join(',');
    const plantQuery = `SELECT plantid, plantname FROM plantmaster WHERE isdeleted = 0 AND plantid IN (${placeholders})`;

    const plantResult = await pool.query(plantQuery, plantIdArray);
    res.json(plantResult.rows);

  } catch (error) {
    console.error('Error fetching plants:', error);
    res.status(500).json({ error: 'Error fetching plants' });
  }
});////////////////////////////////final working code 




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////








///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get all plant names

// app.get('/api/plants', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT PlantID, PlantName FROM PlantMaster');
//     res.json(result.rows); // PostgreSQL uses `.rows`
//   } catch (err) {
//     console.error('Error fetching plants:', err);
//     res.status(500).send('Server error');
//   }
// });   ////////// ye final hai 


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// // ✅ Get all plant master records
app.get('/api/plant-master', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM PlantMaster');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching plants:', error);
    res.status(500).json({ error: 'Failed to fetch plants' });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// // ✅ Delete plant by ID
// app.delete('/api/plant-master/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await pool.query(
//       'DELETE FROM PlantMaster WHERE PlantID = $1 RETURNING *',
//       [id]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({ error: 'Plant not found' });
//     }

//     res.json({ message: 'Plant deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting plant:', error);
//     res.status(500).json({ error: 'Failed to delete plant' });
//   }
// });////// working api



// ✅ Soft delete plant by setting isdeleted = 1/////////////////////////////////////////////////////////////////////////////////////////////////
app.delete('/api/plant-master/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'UPDATE PlantMaster SET isdeleted = 1 WHERE PlantID = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    res.json({ message: '✅ Plant soft deleted successfully' });
  } catch (error) {
    console.error('Error deleting plant:', error);
    res.status(500).json({ error: '❌ Failed to delete plant' });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ✅ Create new plant master record
app.post('/api/plant-master', async (req, res) => {
  const { plantName, plantAddress, contactPerson, mobileNo, remarks } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO PlantMaster (PlantName, PlantAddress, ContactPerson, MobileNo, Remarks) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [plantName, plantAddress, contactPerson, mobileNo, remarks]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating plant:', error);
    res.status(500).json({ error: 'Failed to create plant' });
  }
});

// ✅ Update plant by ID
app.put('/api/plant-master/:id', async (req, res) => {
  const { id } = req.params;
  const { plantName, plantAddress, contactPerson, mobileNo, remarks } = req.body;
  try {
    const result = await pool.query(
      'UPDATE PlantMaster SET PlantName=$1, PlantAddress=$2, ContactPerson=$3, MobileNo=$4, Remarks=$5 WHERE PlantID=$6 RETURNING *',
      [plantName, plantAddress, contactPerson, mobileNo, remarks, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating plant:', error);
    res.status(500).json({ error: 'Failed to update plant' });
  }
});
// ✅ Fixed: Get single plant by ID with camelCase field names
app.get('/api/plantmaster/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
         PlantID AS "plantId", 
         PlantName AS "plantName", 
         PlantAddress AS "plantAddress", 
         ContactPerson AS "contactPerson", 
         MobileNo AS "mobileNo", 
         Remarks AS "remarks" 
       FROM PlantMaster 
       WHERE PlantID = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching plant:', error);
    res.status(500).json({ error: 'Failed to fetch plant' });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////truck transaction api///////////////////////////////////////////////////////////////////////////////////////////////////////
app.post("/api/truck-transaction", async (req, res) => {
  const { formData, tableData } = req.body;
  const truckNo = formData.truckNo.trim().toLowerCase();

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let transactionId = formData.transactionId;

    // 🚫 Truck Already in Transport Check (only for new transactions)
    if (!transactionId) {
      const pendingCheck = await client.query(
        `
        SELECT 1
        FROM trucktransactiondetails d
        JOIN trucktransactionmaster m ON d.transactionid = m.transactionid
        WHERE TRIM(LOWER(m.truckno)) = $1
          AND (d.checkinstatus = 0 OR d.checkoutstatus = 0)
        LIMIT 1
      `,
        [truckNo]
      );

      if (pendingCheck.rows.length > 0) {
        await client.query("ROLLBACK");
        return res.status(409).json({ success: false, message: "🚫 Truck already in transport. Complete check-out first." });
      }
    }

    // ✅ Step 1: Master Insert or Update
    if (transactionId) {
      await client.query(
        `
        UPDATE trucktransactionmaster SET
          truckno = $1,
          transactiondate = $2,
          cityname = $3,
          transporter = $4,
          amountperton = $5,
          truckweight = $6,
          deliverpoint = $7,
          remarks = $8
        WHERE transactionid = $9
      `,
        [
          formData.truckNo,
          formData.transactionDate,
          formData.cityName,
          formData.transporter,
          formData.amountPerTon,
          formData.truckWeight,
          formData.deliverPoint,
          formData.remarks,
          transactionId
        ]
      );
    } else {
      const insertResult = await client.query(
        `
        INSERT INTO trucktransactionmaster
          (truckno, transactiondate, cityname, transporter, amountperton, truckweight, deliverpoint, remarks, createdat)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING transactionid
      `,
        [
          formData.truckNo,
          formData.transactionDate,
          formData.cityName,
          formData.transporter,
          formData.amountPerTon,
          formData.truckWeight,
          formData.deliverPoint,
          formData.remarks
        ]
      );

      transactionId = insertResult.rows[0].transactionid;
    }

    // ✅ Step 2: Handle Details
    const filteredTableData = tableData.filter(row => row.plantName && row.plantName.trim() !== "");

    await client.query(`DELETE FROM trucktransactiondetails WHERE transactionid = $1`, [transactionId]);

    for (const row of filteredTableData) {
      const plantResult = await client.query(
        `SELECT plantid FROM plantmaster WHERE LOWER(TRIM(plantname)) = LOWER(TRIM($1))`,
        [row.plantName]
      );

      const plantId = plantResult.rows[0]?.plantid;
      if (!plantId) throw new Error(`Plant not found: ${row.plantName}`);

      await client.query(
        `
        INSERT INTO trucktransactiondetails
          (transactionid, plantid, loadingslipno, qty, priority, remarks, freight)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7)
      `,
        [
          transactionId,
          plantId,
          row.loadingSlipNo,
          row.qty,
          row.priority,
          row.remarks || "",
          row.freight
        ]
      );
    }

    await client.query("COMMIT");
    res.json({ success: true, transactionId });

  } catch (err) {
    console.error("❌ Transaction failed:", err);
    await client.query("ROLLBACK");
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
});  ///////////////final api hai bus kuch prority vala chang baki hai////////////////////////////////////////////////////////////////////////





// 🚚 Fetch Truck Numbers API (CASE INSENSITIVE)/////////////////////////////////////////////////////////////////////
app.get("/api/trucks", async (req, res) => {
  const { plantName } = req.query;
  try {
    const result = await pool.query(
      `SELECT DISTINCT m.TruckNo
       FROM PlantMaster p
       JOIN TruckTransactionDetails d ON p.PlantID = d.PlantId
       JOIN TruckTransactionMaster m ON d.TransactionId = m.TransactionID
       WHERE LOWER(TRIM(p.PlantName)) = LOWER(TRIM($1))
         AND d.CheckInStatus = 0
         AND m.Completed = 0`,
      [plantName]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching truck numbers:", error);
    res.status(500).json({ error: "Server error" });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// // 🚚 Update Truck Status API (CASE INSENSITIVE)/////////////////////////////////////////////
// app.post("/api/update-truck-status", async (req, res) => {
//   const { truckNo, plantName, invoicenumber , type } = req.body;
//   const client = await pool.connect();
//   try {
//     // 1. Get TransactionID
//     const transactionResult = await client.query(
//       `SELECT TransactionID
//        FROM TruckTransactionMaster
//        WHERE TruckNo = $1 AND Completed = 0
//        ORDER BY TransactionID DESC
//        LIMIT 1`,
//       [truckNo]
//     );
//     if (transactionResult.rows.length === 0) {
//       return res.status(404).json({ message: "❌ Truck not found or already completed" });
//     }
//     const transactionId = transactionResult.rows[0].transactionid;

//     // 2. Get PlantId (CASE INSENSITIVE)
//     const plantResult = await client.query(
//       `SELECT PlantId FROM PlantMaster WHERE LOWER(TRIM(PlantName)) = LOWER(TRIM($1)) LIMIT 1`,
//       [plantName]
//     );
//     if (plantResult.rows.length === 0) {
//       return res.status(404).json({ message: "❌ Plant not found" });
//     }
//     const plantId = plantResult.rows[0].plantid;

//     // 3. Get current status
//     const statusResult = await client.query(
//       `SELECT CheckInStatus, CheckOutStatus
//        FROM TruckTransactionDetails
//        WHERE PlantId = $1 AND TransactionID = $2`,
//       [plantId, transactionId]
//     );
//     if (statusResult.rows.length === 0) {
//       return res.status(404).json({ message: "❌ Truck detail not found for this plant" });
//     }
//     const status = statusResult.rows[0];

//     // 4. Update check-in or check-out
//     if (type === "Check In" && status.checkinstatus === 0) {
//       await client.query(
//         `UPDATE TruckTransactionDetails
//    SET CheckInStatus = 1,
//        CheckInTime = CURRENT_TIMESTAMP
//    WHERE PlantId = $1 AND TransactionID = $2`,
//         [plantId, transactionId]
//       );

//     }
//   //   if (type === "Check Out") {
//   //     if (status.checkinstatus === 0) {
//   //       return res.status(400).json({ message: "❌ Please Check In first before Check Out" });
//   //     }
//   //     if (status.checkoutstatus === 0) {
//   //       await client.query(
//   //         `UPDATE TruckTransactionDetails
//   //  SET CheckOutStatus = 1,
//   //      CheckOutTime = CURRENT_TIMESTAMP
//   //  WHERE PlantId = $1 AND TransactionID = $2`,
//   //         [plantId, transactionId]
//   //       );

//   //     }
//   //   }

//   if (type === "Check Out") {
//   // Check if the truck is checked in first
//   if (status.checkinstatus === 0) {
//     return res.status(400).json({ message: "❌ Please Check In first before Check Out" });
//   }

//   // Check if the truck is already checked out
//   if (status.checkoutstatus === 0) {
//     // Update the truck transaction details with the invoice number and checkout status
//     await client.query(
//       `UPDATE TruckTransactionDetails
//        SET CheckOutStatus = 1,
//            CheckOutTime = CURRENT_TIMESTAMP,
//             invoice_number = $3   -- Update invoice number
//        WHERE PlantId = $1 AND TransactionID = $2`,
//       [plantId, transactionId, invoicenumber]  // Passing the invoice number
//     );

//     return res.status(200).json({ message: "✅ Truck checked out successfully!" });
//   } else {
//     return res.status(400).json({ message: "🚫 This truck has already been checked out." });
//   }
// }



//     // 5. Recheck updated status
//     // 6. Check if all plants for this transaction are checked-in and checked-out
//     const allStatusResult = await client.query(
//       `SELECT COUNT(*) AS totalplants,
//               SUM(CASE WHEN CheckInStatus = 1 THEN 1 ELSE 0 END) AS checkedin,
//               SUM(CASE WHEN CheckOutStatus = 1 THEN 1 ELSE 0 END) AS checkedout
//          FROM TruckTransactionDetails
//          WHERE TransactionID = $1`,
//       [transactionId]
//     );
//     const statusCheck = allStatusResult.rows[0];
//     if (
//       Number(statusCheck.totalplants) === Number(statusCheck.checkedin) &&
//       Number(statusCheck.totalplants) === Number(statusCheck.checkedout)
//     ) {
//       // All plants completed
//       await client.query(
//         `UPDATE TruckTransactionMaster
//          SET Completed = 1
//          WHERE TransactionID = $1`,
//         [transactionId]
//       );
//       return res.json({
//         message: "✅ All plants processed. Truck process completed.",
//       });
//     }
//     // 7. Return success for one action
//     return res.json({ message: `✅ ${type} successful` });
//   } catch (error) {
//     console.error("Status update error:", error);
//     res.status(500).json({ error: "Server error" });
//   } finally {
//     client.release();
//   }
// });///// workingggg///////////////////////////////////////////////////////////////////////////////////////////////////
app.post("/api/update-truck-status", async (req, res) => {
  const { truckNo, plantName, invoicenumber, type } = req.body;
  const client = await pool.connect();
  try {
    // 1. Get TransactionID from TruckTransactionMaster
    const transactionResult = await client.query(
      `SELECT TransactionID
       FROM TruckTransactionMaster
       WHERE TruckNo = $1 AND Completed = 0
       ORDER BY TransactionID DESC
       LIMIT 1`,
      [truckNo]
    );
    if (transactionResult.rows.length === 0) {
      return res.status(404).json({ message: "❌ Truck not found or already completed" });
    }
    const transactionId = transactionResult.rows[0].transactionid;

    // 2. Get PlantId (CASE INSENSITIVE)
    const plantResult = await client.query(
      `SELECT PlantId FROM PlantMaster WHERE LOWER(TRIM(PlantName)) = LOWER(TRIM($1)) LIMIT 1`,
      [plantName]
    );
    if (plantResult.rows.length === 0) {
      return res.status(404).json({ message: "❌ Plant not found" });
    }
    const plantId = plantResult.rows[0].plantid;

    // 3. Get current status from TruckTransactionDetails
    const statusResult = await client.query(
      `SELECT CheckInStatus, CheckOutStatus
       FROM TruckTransactionDetails
       WHERE PlantId = $1 AND TransactionID = $2`,
      [plantId, transactionId]
    );
    if (statusResult.rows.length === 0) {
      return res.status(404).json({ message: "❌ Truck detail not found for this plant" });
    }
    const status = statusResult.rows[0];

    // 4. Handle Check-In
    if (type === "Check In" && status.checkinstatus === 0) {
     

      await client.query(
        `UPDATE TruckTransactionDetails
         SET CheckInStatus = 1,
             CheckInTime = CURRENT_TIMESTAMP
         WHERE PlantId = $1 AND TransactionID = $2`,
        [plantId, transactionId]
      );
      return res.status(200).json({ message: "✅ Truck checked in successfully!" });
    }

    // 5. Handle Check-Out
    if (type === "Check Out") {
      // Check if the truck is checked in first
      if (status.checkinstatus === 0) {
        return res.status(400).json({ message: "❌ Please Check In first before Check Out" });
      }

      // Check if the truck is already checked out
      if (status.checkoutstatus === 1) {
        return res.status(400).json({ message: "🚫 This truck has already been checked out." });
      }

      // Update the truck transaction details with the invoice number and check-out status
      
      await client.query(
        `UPDATE TruckTransactionDetails
         SET CheckOutStatus = 1,
             CheckOutTime = CURRENT_TIMESTAMP,
             invoice_number = $3   -- Update invoice number
         WHERE PlantId = $1 AND TransactionID = $2`,
        [plantId, transactionId, invoicenumber]  // Passing the invoice number
      );

      return res.status(200).json({ message: "✅ Truck checked out successfully!" });
    }

    // 6. Check if all plants for this transaction are checked-in and checked-out
    const allStatusResult = await client.query(
      `SELECT COUNT(*) AS totalplants,
              SUM(CASE WHEN CheckInStatus = 1 THEN 1 ELSE 0 END) AS checkedin,
              SUM(CASE WHEN CheckOutStatus = 1 THEN 1 ELSE 0 END) AS checkedout
         FROM TruckTransactionDetails
         WHERE TransactionID = $1`,
      [transactionId]
    );
    const statusCheck = allStatusResult.rows[0];
    if (
      Number(statusCheck.totalplants) === Number(statusCheck.checkedin) &&
      Number(statusCheck.totalplants) === Number(statusCheck.checkedout)
    ) {
      // All plants completed
      await client.query(
        `UPDATE TruckTransactionMaster
         SET Completed = 1
         WHERE TransactionID = $1`,
        [transactionId]
      );
      return res.json({
        message: "✅ All plants processed. Truck process completed.",
      });
    }

    // 7. Return success for one action
    return res.json({ message: `✅ ${type} successful` });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
});

app.get('/api/check-priority-status', async (req, res) => {
  const { truckNo, plantName } = req.query;
  const client = await pool.connect();

  try {
    // Get the latest active transaction
    const transRes = await client.query(`
      SELECT TransactionID FROM TruckTransactionMaster
      WHERE TruckNo = $1 AND Completed = 0
      ORDER BY TransactionID DESC LIMIT 1
    `, [truckNo]);

    if (transRes.rows.length === 0) {
      return res.json({ hasPending: false });
    }

    const transactionId = String(transRes.rows[0].transactionid);

    // Get all rows with check statuses
    const detailRes = await client.query(`
      SELECT d.Priority, d.CheckInStatus, d.CheckOutStatus, p.PlantName
      FROM TruckTransactionDetails d
      JOIN PlantMaster p ON d.PlantId = p.PlantId
      WHERE d.TransactionID = $1
    `, [transactionId]);

    if (detailRes.rows.length === 0) {
      return res.json({ hasPending: false });
    }

    const sorted = detailRes.rows.sort((a, b) => a.priority - b.priority);

    // Find the lowest pending priority
    const pending = sorted.find(row => row.checkinstatus !== 1 || row.checkoutstatus !== 1);

    if (!pending) {
      return res.json({ hasPending: false });
    }

    const currentRow = sorted.find(row => row.plantname.toLowerCase() === plantName.toLowerCase());

    if (!currentRow) {
      return res.status(400).json({ error: 'Current plant not found in transaction' });
    }

    const canProceed = currentRow.priority === pending.priority;

    res.json({
      hasPending: true,
      canProceed,
      nextPriority: pending.priority,
      nextPlant: pending.plantname,
    });

  } catch (err) {
    console.error('Priority status error:', err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});/////////////  working api for priority status check /////////////////////////////////////////////////////////

app.get('/api/finished-plant', async (req, res) => {
  const { truckNo } = req.query;
  const client = await pool.connect();

  try {
    const transRes = await client.query(`
      SELECT TransactionID 
      FROM TruckTransactionMaster 
      WHERE TruckNo = $1 AND Completed = 0 
      ORDER BY TransactionID DESC LIMIT 1
    `, [truckNo]);

    if (transRes.rows.length === 0) {
      return res.json({ lastFinished: null });
    }

    const transactionId = transRes.rows[0].transactionid;

    const finishedRes = await client.query(`
      SELECT p.PlantName, d.Priority
      FROM TruckTransactionDetails d
      JOIN PlantMaster p ON d.PlantId = p.PlantId
      WHERE d.TransactionID = $1 AND d.CheckInStatus = 1 AND d.CheckOutStatus = 1
      ORDER BY d.Priority DESC
      LIMIT 1
    `, [transactionId]);

    if (finishedRes.rows.length === 0) {
      return res.json({ lastFinished: null });
    }

    res.json({ lastFinished: finishedRes.rows[0].plantname });
  } catch (error) {
    console.error('Error in /api/finished-plant:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});


/////////////////////////////////////////////////////////////////////////

// // 🚚 Truck Report API (for report page) — place this **after** your other APIs
// app.get('/api/truck-report', async (req, res) => {
//   const { truckNo } = req.query;
//   try {
//     const result = await pool.query(
//       `SELECT 
//          ttm.TruckNo AS "truckNo",
//          p.PlantName AS "plantName",
//          ttd.CheckInTime AS "checkInTime",
//          ttd.CheckOutTime AS "checkOutTime",
//          ttd.LoadingSlipNo AS "loadingSlipNo",
//          ttd.Qty AS "qty",
//          ttd.Freight AS "freight",
//          ttd.Priority AS "priority",
//          ttd.Remarks AS "remarks"
//        FROM TruckTransactionDetails ttd
//        JOIN PlantMaster p ON ttd.PlantID = p.PlantID
//        JOIN TruckTransactionMaster ttm ON ttd.TransactionID = ttm.TransactionID
//        WHERE LOWER(ttm.TruckNo) = LOWER($1)
//        ORDER BY ttd.CheckInTime DESC`,
//       [truckNo]  );
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching truck report:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });
// app.get('/api/truck-report', async (req, res) => {
//   const { fromDate, toDate, plant } = req.query;

//   if (!fromDate || !toDate || !plant) {
//     return res.status(400).json({ error: 'Missing required filters' });
//   }

//   try {
//     const result = await pool.query(
//       `SELECT 
//          ttm.TruckNo AS "truckNo",
//          ttm.transactiondate AS "transactionDate",
//          p.PlantName AS "plantName",
//          ttd.CheckInTime AS "checkInTime",
//          ttd.CheckOutTime AS "checkOutTime",
//          ttd.LoadingSlipNo AS "loadingSlipNo",
//          ttd.Qty AS "qty",
//          ttd.Freight AS "freight",
//          ttd.Priority AS "priority",
//          ttd.Remarks AS "remarks"
//        FROM TruckTransactionDetails ttd
//        JOIN PlantMaster p ON ttd.PlantID = p.PlantID
//        JOIN TruckTransactionMaster ttm ON ttd.TransactionID = ttm.TransactionID
//        WHERE ttd.PlantID = $1
//          AND DATE(ttd.CheckInTime) BETWEEN $2 AND $3
//        ORDER BY ttd.CheckInTime DESC`,
//       [plant, fromDate, toDate]
//     );

//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching truck report:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

/////////////////////////////////////////////////
// app.get('/api/truck-report', async (req, res) => {
//   const { fromDate, toDate, plant } = req.query;

//   if (!fromDate || !toDate || !plant) {
//     return res.status(400).json({ error: 'Missing required filters' });
//   }

//   try {
//     const result = await pool.query(
//       `SELECT 
//          ttm.truckno AS "truckNo",
//          ttm.transactiondate AS "transactionDate",
//          p.plantname AS "plantName",
//          ttd.checkintime AS "checkInTime",
//          ttd.checkouttime AS "checkOutTime",
//          ttd.loadingslipno AS "loadingSlipNo",
//          ttd.qty AS "qty",
//          ttd.freight AS "freight",
//          ttd.priority AS "priority",
//          ttd.remarks AS "remarks"
//        FROM trucktransactiondetails ttd
//        JOIN plantmaster p ON ttd.plantid = p.plantid
//        JOIN trucktransactionmaster ttm ON ttd.transactionid = ttm.transactionid
//        WHERE ttd.plantid = $1
//          AND DATE(ttm.transactiondate) BETWEEN $2 AND $3
//        ORDER BY ttm.transactiondate DESC`,
//       [plant, fromDate, toDate]
//     );

//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching truck report:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });//////////////////////////// truk refort working api 




app.get('/api/truck-report', async (req, res) => {
  const { fromDate, toDate, plant } = req.query;

  if (!fromDate || !toDate || !plant) {
    return res.status(400).json({ error: 'Missing required filters' });
  }

  let plantArray = [];
  try {
    plantArray = JSON.parse(plant); 
  } catch (err) {
    return res.status(400).json({ error: 'Invalid plant parameter' });
  }

  if (!Array.isArray(plantArray) || plantArray.length === 0) {
    return res.status(400).json({ error: 'No plants selected' });
  }

  try {
    const placeholders = plantArray.map((_, i) => `$${i + 1}`).join(',');

    const query = `
      SELECT 
         ttm.truckno AS "truckNo",
         ttm.transactiondate AS "transactionDate",
         p.plantname AS "plantName",
         ttd.checkintime AS "checkInTime",
         ttd.checkouttime AS "checkOutTime",
         ttd.loadingslipno AS "loadingSlipNo",
         ttd.qty AS "qty",
         ttd.freight AS "freight",
         ttd.priority AS "priority",
         ttd.remarks AS "remarks"
      FROM trucktransactiondetails ttd
      JOIN plantmaster p ON ttd.plantid = p.plantid
      JOIN trucktransactionmaster ttm ON ttd.transactionid = ttm.transactionid
      WHERE ttd.plantid IN (${placeholders})
        AND DATE(ttm.transactiondate) BETWEEN $${plantArray.length + 1} AND $${plantArray.length + 2}
      ORDER BY ttm.transactiondate DESC
    `;

    const values = [...plantArray, fromDate, toDate];

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching truck report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});








// 🚚 Fetch Checked-in Trucks API (CASE INSENSITIVE)
app.get("/api/checked-in-trucks", async (req, res) => {
  const { plantName } = req.query;
  try {
    const result = await pool.query(
      `SELECT DISTINCT m.TruckNo
       FROM PlantMaster p
       JOIN TruckTransactionDetails d ON p.PlantID = d.PlantID
       JOIN TruckTransactionMaster m ON d.TransactionID = m.TransactionID
       WHERE LOWER(TRIM(p.PlantName)) = LOWER(TRIM($1))
         AND d.CheckInStatus = 1
         AND d.CheckOutStatus = 0`,
      [plantName]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching truck numbers:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🚚 Fetch Remarks API (CASE INSENSITIVE)
app.get('/api/fetch-remarks', async (req, res) => {
  const { plantName, truckNo } = req.query;
  try {
    // Step 1: Get PlantID
    const plantResult = await pool.query(
      'SELECT PlantID FROM PlantMaster WHERE LOWER(TRIM(PlantName)) = LOWER(TRIM($1)) LIMIT 1',
      [plantName]
    );
    if (plantResult.rows.length === 0) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    const plantId = plantResult.rows[0].plantid;

    // Step 2: Get TransactionID
    const txnResult = await pool.query(
      'SELECT TransactionID FROM TruckTransactionMaster WHERE TruckNo = $1 LIMIT 1',
      [truckNo]
    );
    if (txnResult.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    const transactionId = txnResult.rows[0].transactionid;

    // Step 3: Fetch Remarks
    const remarksResult = await pool.query(
      `SELECT Remarks 
       FROM TruckTransactionDetails 
       WHERE PlantID = $1 AND TransactionID = $2 LIMIT 1`,
      [plantId, transactionId]
    );
    if (remarksResult.rows.length === 0) {
      return res.status(404).json({ message: 'Remarks not found' });
    }
    const remarks = remarksResult.rows[0].remarks;
    res.json({ remarks });
  } catch (error) {
    console.error('Error fetching remarks:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ Truck quantity per plant chart API
// app.get('/api/truck-plant-quantities', async (req, res) => {
//   const { truckNo } = req.query;

//   try {
//     const result = await pool.query(`
//       SELECT 
//         p.PlantName,
//         SUM(ttd.Qty) AS quantity
//       FROM TruckTransactionDetails ttd
//       JOIN TruckTransactionMaster ttm ON ttd.TransactionID = ttm.TransactionID
//       JOIN PlantMaster p ON ttd.PlantID = p.PlantID
//       WHERE LOWER(ttm.TruckNo) = LOWER($1)
//         AND ttm.Completed = 0
//       GROUP BY p.PlantName
//       ORDER BY p.PlantName
//     `, [truckNo]);

//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching truck quantities:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


app.post('/api/users', async (req, res) => {
  const { username, password, contactNumber, moduleRights, allowedPlants } = req.body;

  if (!username || !password || !contactNumber) {
    return res.status(400).json({ message: 'Username, password, and contact number are required.' });
  }

  try {
    const roleString = moduleRights.join(',');
    const plantsString = allowedPlants.join(',');

    console.log('👉 Incoming Data:', {
      username, password, contactNumber, roleString, plantsString
    });

    await pool.query(
      `INSERT INTO Users (Username, Password, ContactNumber, Role, AllowedPlants)
       VALUES ($1, $2, $3, $4, $5)`,
      [username, password, contactNumber, roleString, plantsString]
    );

    res.status(201).json({ message: 'User created successfully.' });
  } catch (err) {
    console.error('❌ Error creating user:', err); // ← important fix
    res.status(500).json({ message: 'Error creating user.' });
  }
});//////////////////workingggg

app.get('/api/truck-plant-quantities', async (req, res) => {
  const { truckNo } = req.query;

  try {
    const result = await pool.query(`
      SELECT 
        p.PlantName,
        SUM(ttd.Qty) AS quantity,
        MIN(ttd.Priority) AS priority
      FROM TruckTransactionDetails ttd
      JOIN TruckTransactionMaster ttm ON ttd.TransactionID = ttm.TransactionID
      JOIN PlantMaster p ON ttd.PlantID = p.PlantID
      WHERE LOWER(ttm.TruckNo) = LOWER($1)
        AND ttm.Completed = 0
      GROUP BY p.PlantName
      ORDER BY priority
    `, [truckNo]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching truck quantities:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



////////////////////////////////////////

// // // GET all plants
app.get('/api/plants', async (req, res) => {
  const result = await pool.query('SELECT * FROM plant_master ORDER BY plantname');
  res.json(result.rows);
});//////////////////////////////plant fetch all kar raha hai ye niche edit hoga


/////////////////////////////////////////////////
// POST new user
app.post('/api/user-master', async (req, res) => {
  const { username, plantIds } = req.body;

  if (!username || !Array.isArray(plantIds)) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userRes = await client.query(
      'INSERT INTO user_master(username) VALUES($1) RETURNING userid',
      [username]
    );
    const userId = userRes.rows[0].userid;

    for (const pid of plantIds) {
      await client.query(
        'INSERT INTO user_plants(userid, plantid) VALUES($1, $2)',
        [userId, pid]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
});


//////////////////////////////////////////////////////////////////////
// GET all truck transactions find
app.get('/api/truck-find', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT "truckno", "transactiondate", "cityname"
      FROM "trucktransactionmaster"
      WHERE "truckno" IS NOT NULL AND "completed" = 0
      ORDER BY "transactiondate" DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching truck transactions:', err);
    res.status(500).json({ error: 'Failed to fetch truck data' });
  }
});



app.get('/api/truck-transaction/:truckNo', async (req, res) => {
  let { truckNo } = req.params;
  truckNo = truckNo.trim().toLowerCase();

  try {
    // 1. Check if truck has pending check-in/out
    const pendingCheckQuery = `
      SELECT COUNT(*) as pending
      FROM trucktransactiondetails d
      LEFT JOIN trucktransactionmaster m ON d.transactionid = m.transactionid
      WHERE TRIM(LOWER(m.truckno)) = $1
      AND (d.checkinstatus = 1 AND (d.checkoutstatus = 0 OR d.checkoutstatus IS NULL))
    `;

    const pendingResult = await pool.query(pendingCheckQuery, [truckNo]);

    if (parseInt(pendingResult.rows[0].pending) > 0) {
      return res.json({
        alreadyInTransport: true,
        message: 'Truck already in transport'
      });
    }

    // 2. Fetch Master Data
    const masterQuery = `
      SELECT 
        transactionid, truckno, transactiondate, cityname, 
        transporter, amountperton, deliverpoint, 
        truckweight, remarks
      FROM trucktransactionmaster
      WHERE TRIM(LOWER(truckno)) = $1
      ORDER BY transactionid DESC
      LIMIT 1
    `;

    const masterResult = await pool.query(masterQuery, [truckNo]);

    if (masterResult.rows.length === 0) {
      return res.status(404).json({ message: 'Truck not found' });
    }

    const masterData = masterResult.rows[0];

    // 3. Fetch Details Data
    const detailQuery = `
      SELECT 
        d.plantid, 
        p.plantname,
        d.loadingslipno, d.qty, d.priority, 
        d.remarks, d.freight
      FROM trucktransactiondetails d
      LEFT JOIN plantmaster p ON d.plantid = p.plantid
      WHERE d.transactionid = $1
    `;

    const detailResult = await pool.query(detailQuery, [masterData.transactionid]);

    res.json({
      master: masterData,
      details: detailResult.rows
    });

  } catch (err) {
    console.error('❌ Error fetching truck details:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(
      // 'SELECT "userid", "username", "password", "role", "contactnumber", "allowedplants" FROM users'
      'SELECT "userid", "username", "password", "role", "contactnumber", "allowedplants" FROM users WHERE "isdelete" = 0'
    );
    res.json(result.rows); // return plant IDs (e.g., "7,11")
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users.' });
  }
});


//
// app.delete('/api/users/:username', async (req, res) => {
//   const { username } = req.params;
//   try {
//     const result = await pool.query(
//       'DELETE FROM users WHERE "username" = $1',
//       [username]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     res.json({ message: 'User deleted successfully.' });
//   } catch (err) {
//     console.error('Error deleting user:', err);
//     res.status(500).json({ message: 'Error deleting user.' });
//   }
// });///////////////////perment delect ke liye 

app.delete('/api/users/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Update the IsDelete field to 1 (soft delete)
    const result = await pool.query(
      'UPDATE Users SET IsDelete = 1 WHERE "username" = $1 RETURNING *',
      [username]
    );

    // Check if any rows were updated (if the user was found and updated)
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Success message
    res.json({ message: 'User soft deleted successfully.' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user.' });
  }
});

////////////

app.put('/api/users/:username', async (req, res) => {
  const { username } = req.params;
  let { password, role, contactnumber, allowedplants } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // Normalize role/allowedplants (if array, convert to comma-separated)
  if (Array.isArray(role)) role = role.join(',');
  if (Array.isArray(allowedplants)) allowedplants = allowedplants.join(',');

  try {
    const result = await pool.query(
      `UPDATE users 
       SET password = $1, role = $2, contactnumber = $3, allowedplants = $4 
       WHERE LOWER(username) = LOWER($5)`,
      [password, role, contactnumber || '', allowedplants, username]
    );

    if (result.rowCount > 0) {
      res.json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// BEFORE:
// app.get('/api/plants', async (req, res) => { … });

// AFTER:
app.get('/api/plantmaster', async (req, res) => {
  try {
    // Exactly the same logic you had under /api/plants
    const result = await pool.query('SELECT plantid, plantname FROM plantmaster');
    res.json(
      result.rows.map(r => ({
        plantid: r.plantid,
        plantname: r.plantname
      }))
    );
  } catch (err) {
    console.error('Error fetching plant master:', err);
    res.status(500).json({ message: 'Error fetching plant master.' });
  }
});




app.get('/api/truck-schedule', async (req, res) => {
  const { fromDate, toDate, status, plant } = req.query;

  if (!fromDate || !toDate || !status || !plant) {
    return res.status(400).json({ error: 'Missing required filters' });
  }

  let plantArray = [];
  try {
    plantArray = JSON.parse(plant);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid plant format' });
  }

  if (!Array.isArray(plantArray) || plantArray.length === 0) {
    return res.status(400).json({ error: 'No plants selected' });
  }

  let statusCondition = '';
  if (status === 'Dispatched') {
    statusCondition = 'ttd.checkinstatus = 0 AND ttd.checkoutstatus = 0';
  } else if (status === 'InTransit') {
    statusCondition = 'ttd.checkinstatus = 1 AND (ttd.checkoutstatus = 0 OR ttd.checkoutstatus IS NULL)';
  } else if (status === 'CheckedOut') {
    statusCondition = 'ttd.checkinstatus = 1 AND ttd.checkoutstatus = 1';
  } else if (status === 'All') {
    statusCondition = '1=1';
  } else {
    return res.status(400).json({ error: 'Invalid status filter' });
  }

  try {
    const placeholders = plantArray.map((_, i) => `$${i + 1}`).join(',');
    const dateStartIndex = plantArray.length + 1;

    const query = `
      SELECT 
        ttm.truckno AS "truckNo",
        ttm.transactiondate AS "transactionDate",
        p.plantname AS "plantName",
        ttd.checkintime AS "checkInTime",
        ttd.checkouttime AS "checkOutTime",
        ttd.loadingslipno AS "loadingSlipNo",
        ttd.qty AS "qty",
        ttd.freight AS "freight",
        ttd.priority AS "priority",
        ttd.remarks AS "remarks"
      FROM trucktransactiondetails ttd
      JOIN plantmaster p ON ttd.plantid = p.plantid
      JOIN trucktransactionmaster ttm ON ttd.transactionid = ttm.transactionid
      WHERE ttd.plantid IN (${placeholders})
        AND DATE(ttm.transactiondate) BETWEEN $${dateStartIndex} AND $${dateStartIndex + 1}
        AND ${statusCondition}
      ORDER BY ttm.transactiondate DESC
    `;

    const values = [...plantArray, fromDate, toDate];

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching truck schedule:', err);
    res.status(500).json({ error: 'Server error' });
  }
});





// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
