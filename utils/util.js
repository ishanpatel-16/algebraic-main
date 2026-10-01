import fs from 'fs';
import officeToPdf from 'office-to-pdf';
import path from 'path';



export function saveImage(path, file_name, data) {

  const randomFilename =
    Date.now() + "-" + Math.round(Math.random() * 1000) + file_name;

  fs.writeFile(path + randomFilename, data, (err) => {
    if (err) {
      throw err;
    }
  });
  return randomFilename;
};



export function saveDocument(path, file_name, data) {

  return new Promise(function(resolve, reject) {
    fs.writeFile(path + file_name, data, function(err) {
        if (err) reject(err);
        else resolve(file_name);
    });
});
};

export function saveToPdf(wordFileName, pdfFilename) {

  const wordDirPath='./documents/word-document/'
  const pdfDirPath= './documents/pdf-document/'
  
  if(fs.existsSync(wordDirPath+wordFileName)){
    var wordBuffer =fs.readFileSync(wordDirPath+wordFileName)
    officeToPDF(wordBuffer).then(
    (pdfBuffer) => {
      fs.writeFileSync(pdfDirPath+pdfFilename+'.pdf', pdfBuffer)
    }, (err) => {
      console.log(err)
    }
  )
  }
 
return pdfFilename+'.pdf';
}

