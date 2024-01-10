newly added routes 

/header

get ->  get all headers 
response: 

{
  "_id": "65981e2ae4b1eec15c695504",
  "header1": "Buy 1 Get 1 Free",
  "header2": "Winter Collection",
  "header3": "PauseBD",
  "header4": "Your Truest Companion",
  "__v": 0
}

patch -> edit headers

req: 

{
    "header1":"Buy 1 Get 1 Free",
    "header2":"Winter Collection",
    "header3":"PauseBD",
    "header4":"Your Truest Companion"
}


-----------------------------

collection: 

/detail/id 

get: get details of a specific collection

{
  "collection": {
    "_id": "654b8a2a198ba93a50c1fc67",
    "name": "Call Me When You Get Home",
    "portrait": [
      "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNsb3RoaW5nfGVufDB8fDB8fHww"
    ],
    "landscape": [
      "https://lonelyghost.co/cdn/shop/files/New_Arrivals_Desktop_Homepage_Banner_Nov_23_5c1105c0-ad65-46eb-8d06-75efa75f8bc5.png?v=1698763176&width=2000"
    ],
    "date": "2023-11-08T13:16:26.707Z",
    "__v": 0,
    "isFeatured": true,
    "order": 24
  }
}


-------------------------------- 

I have sorted getProductWiseIncome 



------------------new-----------------------------

getColorByCategory 

get:

/product/colorcategory/<category_id>

get:

/order/delivery

to get delivery charge and admin phone number


--------------newly added (1/10/23)----------------------------

product/filter/collection/id 

req type: post 
format:  same as product filter

--->
product/filter/category/id 

req type: post 
format:  same as product filter





