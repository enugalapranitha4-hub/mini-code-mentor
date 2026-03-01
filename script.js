
document.getElementById('runBtn').addEventListener('click', () => {
    const code = document.getElementById('codeInput').value;
    const output = document.getElementById('output');
    output.innerHTML = ""; // clear previous output

    if(!code.trim()){
        output.textContent = "Please enter some code first!";
        return;
    }

    let explanation = "";
    const lang = document.getElementById('language').value;

    // --------------------
    // PYTHON HANDLING
    // --------------------
    if(lang === "python"){
        // num = … check
        let numMatch = code.match(/num\s*=\s*(\d+)/);
        if(numMatch){
            let num = parseInt(numMatch[1]);
            explanation += num % 2 === 0 ? `${num} is even\n` : `${num} is odd\n`;
            if(num <= 1){ explanation += `${num} is not prime\n`; }
            else{
                let prime = true;
                for(let i=2;i<num;i++){ if(num%i===0){prime=false;break;} }
                explanation += prime ? `${num} is prime\n` : `${num} is not prime\n`;
            }
        }

        // print() outputs
        const printMatches = code.match(/print\((.*)\)/g);
        if(printMatches){
            printMatches.forEach(p=>{
                const content = p.replace(/print\(|\)/g,'').replace(/['"]/g,'');
                explanation += "Output: "+content+"\n";
            });
        } else if(code.includes("print")){
            explanation += "⚠️ Hint: print missing parentheses\n";
        }

        // syntax tips for missing colons
        const lines = code.split('\n');
        lines.forEach(line=>{
            const t = line.trim();
            if((t.startsWith("if")||t.startsWith("else")||t.startsWith("for")||t.startsWith("while")||t.startsWith("def")) && !t.endsWith(":")){
                explanation += `⚠️ Hint: Missing ':' after '${t.split(' ')[0]}'\n`;
            }
            if(t.startsWith("print") && !t.includes("(")){
                explanation += "⚠️ Hint: print missing parentheses\n";
            }
        });
    }

    // --------------------
    // C LANGUAGE HANDLING
    // --------------------
    if(lang === "c"){
        const lines = code.split("\n");

        // Check for int main()
        if(!code.includes("int main")){
            explanation += "⚠️ Hint: C programs need an 'int main()' function as entry point.\n";
        }

        // Check for printf usage
        if(code.includes("printf")){
            explanation += "✅ printf statement detected for output.\n";
        } else {
            explanation += "⚠️ Hint: Remember to use printf() to display output.\n";
        }

        // Check each line for common errors
        lines.forEach(line=>{
            const t = line.trim();
            // Missing semicolon at end of lines that are statements
            if(t && !t.startsWith("#") && !t.endsWith(";") && 
               !t.includes("{") && !t.includes("}") && 
               !t.startsWith("int main") && !t.startsWith("for") && !t.startsWith("while") && !t.startsWith("if")){
                explanation += `⚠️ Hint: Missing ';' at the end of line: "${t}"\n`;
            }
            // Check for printf without parentheses
            if(t.includes("printf") && !t.includes("(")){
                explanation += "⚠️ Hint: printf missing parentheses\n";
            }
            // Check for return statement missing semicolon
            if(t.startsWith("return") && !t.endsWith(";")){
                explanation += `⚠️ Hint: Missing ';' at the end of 'return' statement\n`;
            }
        });
    }

    if(!explanation) explanation = "✅ Your code looks good!";
    output.textContent = explanation;
});