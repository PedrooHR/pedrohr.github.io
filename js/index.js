function O(x) {
    return document.getElementById(x);
}

var language = "";
var lang_display = O("lang").innerHTML;

O("lang").addEventListener("click", function() {
    if (language == "") {
        language = "-br";
        O("lang").innerHTML = "PT-BR";
        O("about").innerHTML = "Sobre";
        O("publications").innerHTML = "Publicações";
        O("contact").innerHTML = "Contato";
    } else if (language == "-br") {
        language = "";
        O("lang").innerHTML = "EN-US";
        O("about").innerHTML = "About";
        O("publications").innerHTML = "Publications";
        O("contact").innerHTML = "Contact";
    }
    lang_display = O("lang").innerHTML;
    O("zero-md-content").src = "content/home" + language + ".md"
    O("social").src = "content/social" + language + ".md";
}, false);

O("lang").addEventListener("mouseover", function() {
    let initial_value = O("lang").innerHTML;
    if (language == "") {
        O("lang").innerHTML = "PT-BR";
    } else if (language == "-br") {
        O("lang").innerHTML = "EN-US";
    }
}, false);

O("lang").addEventListener("mouseleave", function() {
    O("lang").innerHTML = lang_display;
}, false);

O("home").addEventListener("click", function() {
    O("zero-md-content").src = "content/home" + language + ".md"
}, false);

O("about").addEventListener("click", function() {
    O("zero-md-content").src = "content/about" + language + ".md"
}, false);

O("publications").addEventListener("click", function() {
    O("zero-md-content").src = "content/publications" + language + ".md"
}, false);

O("contact").addEventListener("click", function() {
    O("zero-md-content").src = "content/contact" + language + ".md"
}, false);