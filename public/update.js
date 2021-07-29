const url=new URLSearchParams(window.location.search);
let centername=url.get('centername');
console.log(centername)
document.getElementById("center").value=centername
let address=url.get('address');
document.getElementById("address").value=address
let district=url.get('district');
document.getElementById("district").value=district
let pincode=url.get('pincode');
document.getElementById("pincode").value=pincode
let vaccine=url.get('vaccine');
document.getElementById("vaccine").value=vaccine
let slots=url.get('slots');
document.getElementById("slots").value=slots
let id=url.get("num");
console.log(id)
document.getElementById("num").value=id
