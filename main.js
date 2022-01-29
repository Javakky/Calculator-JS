function getButton1() {
    var scanData = divisionToken(document.getElementById("formulaid").value);
    
    var Source = function(data){
        this.data = data;
        this.pos = 0;

        this.nextpos = function(){
            this.pos += 1;
        }
    }

    Source.prototype.getToken = function(){
        if(this.pos >= this.data.lenght)
            return "";
        return this.data[this.pos];
    }
    var dataset = new Source(scanData);
    window.alert(add_sub(dataset));
}

function divisionToken(data){
    var m;
    var formulaString = data;
    //formulaString = formulaString.split(/\s/).join('');
    var r = /(?:(?:0x|0)?(?:[1-9][0-9]*|0)(?:\.[0-9]*)?(?:e[1-9][0-9]*)?)|×|・|÷|√|,|\^|\*|!|\+|-|\/|%|\(|\)|\||π|(?:[a-zA-Z_][a-zA-Z0-9_]*)/g;
    var a = [];
    while ((m = r.exec(formulaString)) != null){
        a.push(m[0]);
    }
    return a;
}

function add_sub(dataset){
    var x = mul_div(dataset);
    for(;;){
        switch(dataset.getToken()){
            case "+":
                dataset.nextpos();
                x += mul_div(dataset);
                continue;
            case "-":
                dataset.nextpos();
                x -= mul_div(dataset);
                continue;
        }
        break;
    }

    return x;
}

function mul_div(dataset){
    var x = pow(dataset);
    for(;;){
        switch(dataset.getToken()){
            case "*":
            case "×":
            case "・":
                dataset.nextpos();
                x *= pow(dataset);
                continue;
            case "/":
            case "÷":
                dataset.nextpos();
                x /= pow(dataset);
                continue;
            case "%":
            case "mod":
                dataset.nextpos();
                x %= pow(dataset);
                continue;
        }
        break;
    }

    return x;
}

function pow(dataset){
    var x = factorial(dataset);
    for(;;){
        if(dataset.getToken() == "^"){
            dataset.nextpos();
            var y = factorial(dataset);
            x = Math.pow(x, y);
            continue;
        }
        if(dataset.getToken() == "√"){
            dataset.nextpos();
            var y = factorial(dataset);
            x = Math.pow(y, 1/x);
            continue;
        }
        break;
    }

    return x;
}

function factorial(dataset){
    var x = brackets(dataset);

    for(;;){
        if(dataset.getToken() == "!"){
            dataset.nextpos();
            if(x == 0){
                x = 1;
            }
            else{
                var i;
                var y = x;
                x = 1;
                for(i = 1; i <= y; i++){
                    x *= i;
                }
            }
        }
        break;
    }

    return x;
}

function brackets(dataset){
    var x = minus(dataset);
    if(x == "("){
        x = add_sub(dataset);
        if(dataset.getToken() == ")"){
            dataset.nextpos();
        }
    }else if(x == "|"){
        x = add_sub(dataset);
        if(dataset.getToken() == "|"){
            if(x < 0){
                x *= -1;
            }
            dataset.nextpos();
        }
    }else if(!isNaN(x)){
        x = Number(x);
    }
    return x;
}

function minus(dataset){

    var x = func(dataset);
    if(x == "-"){
        x = add_sub(dataset) * -1;
    }else if(x == "√"){
        var y = Number(add_sub(dataset));
        x = Math.sqrt(y);
    }
    else if(!isNaN(x)){
        x = Number(x);
    }
    return x;
}

function func(dataset){
    var x = dataset.getToken();
    dataset.nextpos();
    if(x == "e"){
        x = Math.E;
    }else if(x.match(/[a-zA-z][a-zA-Z0-9_]*/)){
        var func;
        func = x;
        x = dataset.getToken();
        dataset.nextpos();
        if(x == "("){
            x = [];
            for(;;){
                x.push(add_sub(dataset));
                if(dataset.getToken() == ")"){
                    dataset.nextpos();
                    x = originFunc(func, x);
                }else if(dataset.getToken() == ","){
                    dataset.nextpos();
                    continue;
                }
                break;
            }
        }
    }else if(!isNaN(x) || x == "π"){
        if(x == "π"){
            x = Math.PI;
        }
        x = Number(x);
    }
    return x;

}

function originFunc(FuncName, x){
    var y;
    if(FuncName == 'sin'){
        y = Math.sin(x[0]);
    }else if(FuncName == 'cos'){
        y = Math.cos(x[0]);
    }else if(FuncName == 'tan'){
        y = Math.tan(x[0]);
    }else if(FuncName == 'asin'){
        y = Math.asin(x[0]);
    }else if(FuncName == 'acos'){
        y = Math.acos(x[0]);
    }else if(FuncName == 'atan'){
        y = Math.atan(x[0]);
    }else if(FuncName == 'abs'){
        y = Math.abs(x[0]);
    }else if(FuncName == 'ln'){
        y = Math.log(x[0]);
    }else if(FuncName == 'log'){
        if(x[1] != undefined){
            y = log(x[0], x[1]);
        }else{
            y = log(10, x[0]);
        }
    }else if(FuncName == 'mod'){
        y = x[0] % x[1];
    }else if(FuncName == 'gcd'){
        y = gcd(x[0], x[1]);
    }else if(FuncName == 'lcm'){
        y = x[0] * x[1] / gcd(x[0], x[1]);
    }else if(FuncName == 'hyper'){
        y = hyper(x[0], x[1], x[2]);
    }else if(FuncName == 'pow'){
        y = Math.pow(x[0], x[1]);
    }else if(FuncName == 'part'){
        if(x[1] != undefined){
            y = part(x[0], x[1]);
        }else{
            y = part(x[0], x[0]);
        }
    }else if(FuncName == 'mobius'){
        y = mobius(x[0]);
    }else if(FuncName == 'floor'){
        y = Math.floor(x[0]);
    }else if(FuncName == 'ceil'){
        y = Math.ceil(x[0]);
    }else if(FuncName == 'fib'){
        y = fib(x[0]);
    }else if(FuncName == 'arithmetic'){
        y = x[0] + (x[2] - 1) * x[1];
    }else if(FuncName == 'geometric'){
        y = x[0] * pow(x[1], (x[2] - 1));
    }

    return y;

}

function fib(n){
    if(n == 1){
        return 1;
    }
    if(n == 2){
        return 1;
    }

    return fib(n - 1) + fib(n - 2);
}

function mobius(n){
    var ans = 1;
    for (var d = 2; d <= n; ++d) {
        if (n % (d*d) == 0){ return 0;}
        else if (n % d == 0){ n /= d; ans *= -1;}
    }
    return ans;
}

function part(n, k){
    if(n == 1 || k == 1){
        return 1;
    }else if(n < 0 || k < 1){
        return 0;
    }else{
        return part(n - k, k) + part(n, k - 1);
    }
}

function log(a, M){

    var y = Math.log(M) / Math.log(a);

    return y;

}

function gcd(x, y){
    var ans = x % y;

    while(ans != 0){
        x = y;
        y = ans;
        ans = x % y;
    }

    return y;
}

function hyper(x, n, y){
    var i;
    var ans = x;
    if(n == 1){
        return x + y;
    }/*else if(n == 2){
        return x * y;
    }else if(n == 3){
        return Math.pow(x, y);
    }*/
    for(i = 1; i < y; i++){
        ans = hyper(ans, n - 1, x);
    }
    return ans;
}
