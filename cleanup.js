const fs = require('fs');
['find-a.js', 'src/grep.exe.stackdump', '{file', '{if(line.toLowerCase().includes(\'\'']
.forEach(f => { try { fs.unlinkSync(f) } catch(e) {} });
