# PDF Extractor
PDF Extractor is a tool that helps to extract data from pdf files and convert them to json format. Many of the pdf extraction packages generate complicated json that can be hard to parse, 
PDF Extractor takes the load of doing this parsing and generates json containing row/line wise pdf data.

### Syntax  

```
node extractor.js parse [arguments]

Arguments for pdf parser

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
  --input    The directory containing the pdf files.         [string] [required]
  --output   JSON file that stores the extracted data line wise for each pdf    
             file.                                           [string] [required]
  --regex    Read only the pdf files that match the regular expression. [string]
  --save     Save intermediate detailed json data in the folder ./json. Only use
             if you are doing manual parsing later.                     [boolean]
  
 ```
 
 ### Example  
 ```
 node extractor.js parse --input='C:\Users\Arun\Desktop\FINAL_YEAR_PROJECT\Technical Seminar\\' --output=references.json --save=false --regex=^[0-9]*.pdf$ 
 ```
Ending line is the upto which a particular file must be read  
This will generate the file references.json with the following content
 ```
 {"1.pdf":{"1":"ResearchArticle ","2":"ConsensusMechanismofIoTBasedonBlockchainTechnology ","3":"YueWu   1   2 LiangtuSong  1   2 LeiLiu  1   2 JinchengLi  1   2 XuefeiLi  1   2 andLinliZhou 1   2 "}}
 ```
 1.pdf represents the filename.
 Each of the numbers 1, 2, 3 represent the line number of the text in the pdf file.
 
 ### Technical Jargon
 You must have noticed a file name `lines.json` that was generated after the prompts for the page numbers and the ending lines.  
To skip the prompt each time you extract data from the files in a directory, you can manually generate the `lines.json` file with the following format
```
{ "filename": {"page": <page no here>, "endLine": <ending line here> } }
```
The prompt data will be read directly from this file.  
  
You can also make use of the functions in this module in other files.
```
const pdfExtractor = require('extractor')
```
