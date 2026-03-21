# Testing & Sample Data Guide

## Sample Student Data

Use this data to create a test Excel file (.xlsx):

### Sample Data 1: Basic Test (5 Students)

| Student Name | Register Number | Database | OOP | Networks | Web Dev |
|--------------|-----------------|----------|-----|----------|---------|
| Aarav Kumar  | REG001          | O        | A+  | A        | B+      |
| Bhavna Singh | REG002          | A        | B+  | O        | A       |
| Chetan Patel | REG003          | U        | B   | A        | B       |
| Divya Sharma | REG004          | A+       | A   | B+       | A+      |
| Esha Gupta   | REG005          | B        | B   | B+       | B       |

**How to create this Excel file:**

1. Open Microsoft Excel or LibreOffice Calc
2. Enter the data exactly as shown above
3. Save as: `test_students.xlsx`
4. Upload to the application

**Expected Results:**
- Total Students: 5
- Failed: 1 (Chetan - U in Database)
- Top 10: Showing all 5 students with GPAs

### Sample Calculation for Aarav Kumar

Credits: Database=4, OOP=4, Networks=4, Web Dev=4

```
Database:  O  × 4 = 10 × 4 = 40
OOP:       A+ × 4 =  9 × 4 = 36
Networks:  A  × 4 =  8 × 4 = 32
Web Dev:   B+ × 4 =  7 × 4 = 28

GPA = (40 + 36 + 32 + 28) / 16 = 136 / 16 = 8.50
```

### Sample Data 2: Large Class (20 Students)

For stress testing, create 20 students with various grades:

| Student Name | Register Number | Subject1 | Subject2 | Subject3 | Subject4 | Subject5 |
|--------------|-----------------|----------|----------|----------|----------|----------|
| Student 1    | STU001          | O        | O        | A+       | A+       | A        |
| Student 2    | STU002          | A+       | A+       | A        | A        | A        |
| Student 3    | STU003          | A        | A        | A        | B+       | B+       |
| Student 4    | STU004          | B+       | B+       | B+       | B+       | B        |
| Student 5    | STU005          | B        | B        | B        | C        | C        |
| Student 6    | STU006          | O        | O        | O        | A+       | A+       |
| Student 7    | STU007          | A+       | A+       | A+       | A        | A        |
| Student 8    | STU008          | A        | A        | B+       | B+       | B+       |
| Student 9    | STU009          | B+       | B+       | B        | B        | C        |
| Student 10   | STU010          | C        | C        | C        | C        | U        |
| Student 11   | STU011          | O        | A+       | A        | B+       | B        |
| Student 12   | STU012          | A+       | A        | B+       | B        | C        |
| Student 13   | STU013          | A        | B+       | B        | C        | C        |
| Student 14   | STU014          | B+       | B        | C        | C        | U        |
| Student 15   | STU015          | O        | O        | A+       | A+       | A+       |
| Student 16   | STU016          | A+       | A+       | A+       | A        | A        |
| Student 17   | STU017          | A        | A        | A        | B+       | B+       |
| Student 18   | STU018          | B+       | B+       | B        | B        | C        |
| Student 19   | STU019          | B        | B        | C        | C        | U        |
| Student 20   | STU020          | O        | A+       | A+       | B+       | B+       |

**Test Results:**
- Total: 20 students
- Failed: 4 (students with U grades)
- Passed: 16
- Top 10: Students 1, 6, 15, 2, 7, 16, 3, 17, 11, 12

## Step-by-Step Testing

### Test 1: Basic Upload

1. Start the application: `npm run dev`
2. Open http://localhost:3000
3. Drag and drop the test_students.xlsx file
4. Enter credits for each subject:
   - Database: 4
   - OOP: 4
   - Networks: 4
   - Web Dev: 4
5. Click "Calculate GPA"
6. Verify results display correctly

### Test 2: Search Functionality

1. In the Results view, search for: `REG002`
2. Verify: Only Bhavna Singh (REG002) shows
3. Clear search to show all students

### Test 3: Sort Functionality

1. Click "GPA (High to Low)" - should show Aarav Kumar first (8.50)
2. Click "Name (A to Z)" - should show Aarav Kumar first alphabetically

### Test 4: Top 10 Filter

1. Click "Showing Top 10" button
2. Should highlight only top students
3. Click again to show all students

### Test 5: Failed Students

1. Students with "U" grade should have red background
2. Chetan Patel (REG003) should be highlighted in red

### Test 6: Download

1. Click "Download Excel" button
2. File "GPA_Result.xlsx" should download
3. Open file to verify:
   - All students included
   - GPA column added
   - Credit columns included
   - Grades intact

## Verifying Excel File Format

Your Excel file must have:
- ✅ .xlsx format (not .xls or .csv)
- ✅ First row can be headers (automatic detection)
- ✅ Student name in column A
- ✅ Register number in column B
- ✅ Subject grades in remaining columns
- ✅ Valid grades: O, A+, A, B+, B, C, U
- ✅ No blank rows at the top

## Grade Conversion Reference

These MUST be used for calculation:

```
O   = 10.0 points   (Outstanding)
A+  = 9.0 points    (Excellent)
A   = 8.0 points    (Very Good)
B+  = 7.0 points    (Good)
B   = 6.0 points    (Average)
C   = 5.0 points    (Pass)
U   = 0.0 points    (Fail/Absent/Incomplete)
```

## Error Testing

### Test negative cases:

1. **Wrong file type**: Upload a .csv or .txt file
   - Expected: Error "Invalid file type"

2. **Empty Excel**: Upload an empty .xlsx file
   - Expected: Error "No data found"

3. **Missing columns**: Upload file with only 2 columns
   - Expected: Error "No subject columns found"

4. **Missing grades**: Enter credits but don't provide all grades
   - Expected: Application should handle gracefully

## Performance Testing

### Test with large file:

1. Create 100 student rows with 10 subjects each
2. Upload the file
3. Enter credits for all 10 subjects
4. Calculate GPA
5. Expected time: < 2 seconds total

### Network testing:

1. Throttle network to "Slow 3G" in DevTools
2. Upload file and calculate
3. Should still work smoothly with loading indicators

## Browser Testing

Test on different browsers:

- ✅ Chrome (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

## Accessibility Testing

1. Tab through all inputs
2. Test with screen readers
3. Verify color contrast ratios
4. Test keyboard navigation

## Final Verification Checklist

- [ ] File upload works
- [ ] Column detection works
- [ ] Credits form displays correctly
- [ ] GPA calculation is accurate
- [ ] Results table displays all students
- [ ] Search functionality works
- [ ] Sort functionality works
- [ ] Top 10 filter works
- [ ] Failed students highlighted
- [ ] Download Excel works
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] No memory leaks
- [ ] Performance acceptable

---

**Ready to test? Start with:** `npm run dev`
