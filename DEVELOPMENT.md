# Development Instructions

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in browser
```

## Testing the Application

### Step 1: Prepare Sample Data
You can use the included `sample_students.xlsx` file to test the application.
- File location: `./sample_students.xlsx`
- Contains 5 sample students with grades

### Step 2: Upload Excel File
1. Go to http://localhost:3000
2. Click "Select File" or drag-and-drop the Excel file
3. The system will automatically detect:
   - Student names
   - Register numbers
   - Subject columns

### Step 3: Enter Credits
1. Enter credits for each subject (e.g., 4.0 for 4 credit courses)
2. Click "Calculate GPA"

### Step 4: View Results
- See all students with calculated GPA
- View top 10 students highlighted in green
- Failed students (U grade) highlighted in red
- Search by register number
- Sort by GPA or name
- Download results as Excel file

## Sample Excel Format

Create an Excel file (.xlsx) with this structure:

| Student Name | Register Number | Database | OOP | Networks | Web Dev |
|--------------|-----------------|----------|-----|----------|---------|
| John Doe     | REG001          | O        | A+  | A        | B+      |
| Jane Smith   | REG002          | A        | B+  | O        | A       |
| Bob Johnson  | REG003          | U        | B   | A        | B       |

## Grade Scale (Anna University)

- **O** = 10 points (Outstanding)
- **A+** = 9 points (Excellent)
- **A** = 8 points (Very Good)
- **B+** = 7 points (Good)
- **B** = 6 points (Average)
- **C** = 5 points (Pass)
- **U** = 0 points (Fail/Absent)

## GPA Calculation

Example calculation for John Doe:
```
Database:  O  × 4 credits = 10 × 4 = 40
OOP:       A+ × 4 credits =  9 × 4 = 36
Networks:  A  × 4 credits =  8 × 4 = 32
Web Dev:   B+ × 4 credits =  7 × 4 = 28

Total Points: 40 + 36 + 32 + 28 = 136
Total Credits: 4 + 4 + 4 + 4 = 16
GPA = 136 / 16 = 8.50
```

## Troubleshooting

### "Invalid file type" error
- Make sure file is .xlsx format (not .xls or .csv)
- Some older Excel formats are not supported

### "No data found" error
- Ensure Excel file has at least 3 columns: Name, Register Number, and one subject
- Delete empty rows above the data
- Save file as .xlsx

### "No subject columns found"
- Ensure there are columns after Name and Register Number
- These become subject columns

### Grades showing as 0 GPA
- Check that grades are in valid format: O, A+, A, B+, B, C, U
- Verify credits are positive numbers
- Make sure no grades are left blank

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Deployment to Vercel

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push
```

2. Go to https://vercel.com
3. Click "New Project"
4. Import GitHub repository
5. Click "Deploy"

No environment variables needed!

## File Structure Reference

```
gpa-calculator/
├── app/
│   ├── api/
│   │   ├── upload/route.ts      # Parse Excel file
│   │   ├── calculate/route.ts   # Calculate GPA
│   │   └── download/route.ts    # Generate Excel download
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main page
│   └── globals.css              # Global styles
├── components/
│   ├── Upload.tsx               # Drag-drop upload
│   ├── CreditsForm.tsx          # Credit input
│   ├── ResultsTable.tsx         # Results display
│   └── LoadingSpinner.tsx       # Loading UI
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind CSS config
└── README.md                    # Full documentation
```

## Performance Notes

- Processes files with 100+ students instantly
- Optimized for Vercel's serverless environment
- No database required - all processing in-memory
- File size limit: ~5MB

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers

---

For more detailed documentation, see README.md
