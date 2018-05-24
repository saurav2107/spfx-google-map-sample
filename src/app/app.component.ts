import { Component, Input, HostBinding, HostListener, ElementRef,ViewChild,NgZone,OnInit,OnDestroy } from '@angular/core';
import { GoodzerService } from './services/goodzer.service';
import { AppSettings } from './app.settings';
//import { Version } from '@microsoft/sp-core-library';
import {} from '@types/googlemaps';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

declare var google;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`
  * {
  box-sizing: border-box;
}

#map {
  width: 100%;
  height: 500px;
}


input[type=text], select, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}

label {
  padding: 12px 12px 12px 0;
  display: inline-block;
}

input[type=submit] {
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
}

input[type=submit]:hover {
  background-color: #45a049;
}

.container {
  border-radius: 5px;
  background-color: #f2f2f2;
  padding: 20px;
}

.col-25 {
  float: left;
  width: 25%;
  margin-top: 6px;
}

.col-75 {
  float: left;
  width: 75%;
  margin-top: 6px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

/* Responsive layout - when the screen is less than 600px wide, make the two columns stack on top of each other instead of next to each other */
@media screen and (max-width: 600px) {
  .col-25, .col-75, input[type=submit] {
      width: 100%;
      margin-top: 0;
  }
}
  `]
})




export class AppComponent {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  searchText:string='';
  lat:number;
  lng:number;
  markerArray:Array<any>;
  mylatLng:any;
  loading:any;
  directionsService:any;
  directionsDisplay:any;
  

  @Input() description = 'Angular';
  @Input() latitude = '40.708859';
  @Input() longitude = '-74.008175';
  // title = 'Angular';
  constructor(elm: ElementRef,private goodzerService:GoodzerService,public _ngZone: NgZone) {
    this.description = elm.nativeElement.getAttribute('description');
    this.latitude = elm.nativeElement.getAttribute('latitude');
    this.longitude = elm.nativeElement.getAttribute('longitude');
    this.lat = parseFloat(this.latitude);
    this.lng = parseFloat(this.longitude);         
    
    this.addMapsScript();
  }

  addMapsScript() {
    if (!document.querySelectorAll(`[src="${AppSettings.GMAP_URL}"]`).length) { 
      document.body.appendChild(Object.assign(
        document.createElement('script'), {
          type: 'text/javascript',
          src: AppSettings.GMAP_URL,
          onload: () => this.doMapInitLogic()
        }));
    } else {
      this.doMapInitLogic();
    }
  }

  doMapInitLogic()
  {
    
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.loadMap();
  }

  ngOnInit()
  {
    window["angularComponentRef"] = { component: this, zone: this._ngZone };
    
  }

  ngOnDestroy()
  {
    window["angularComponentRef"] = null;
  }

  setMapOnAll(map) {
    for (var i = 0; i < this.markerArray.length; i++) {
      this.markerArray[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  clearMarkers() {
    this.setMapOnAll(null);
    this.directionsDisplay.setMap(null);
  }

loadMap(){
this.markerArray = Array<any>();
 
   this.mylatLng = new google.maps.LatLng(this.lat, this.lng);

let mapOptions = {
  center: this.mylatLng,
  zoom: 15,
  mapTypeId: google.maps.MapTypeId.ROADMAP
}

this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
this.directionsDisplay.setMap(this.map);


let marker = new google.maps.Marker({
map: this.map,
draggable:true,
icon: './assets/you.png',

position: this.mylatLng
});

google.maps.event.addListener(marker, 'dragend', (newmarker) =>
{


this.mylatLng = new google.maps.LatLng(newmarker.latLng.lat(),newmarker.latLng.lng()); 

this.lat = this.mylatLng.lat();
this.lng = this.mylatLng.lng();






});



let content = "<h4>You are Here!</h4>";          

this.addInfoWindow(marker, content);


}

onInput(event)
{
if (this.searchText != '')
      this.search();
}

onCancel(event)
{
this.clearMarkers();
}

search()
{
this.clearMarkers();
this.directionsDisplay.setMap(this.map);
    

 this.goodzerService.searchLocations(this.searchText,this.lat.toString(),this.lng.toString())
 .subscribe(res=> {
    
    
    
    if (res.locations != undefined)
      {
    res.locations.forEach(element => {
       let latLng = new google.maps.LatLng(element.lat, element.lng);
    let marker = new google.maps.Marker({
map: this.map,
icon: './assets/shop.png',
animation: google.maps.Animation.DROP,
position: latLng
});

this.markerArray.push(marker);

let content = "<h2>"+element.name+"</h2> <h5>We have "+this.searchText+" and you are welcome to see.</h5>"+
 '<button ion-button block onclick="window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.loadDirection(\'' + element.lat + '\',\''+element.lng+'\'  );})">Show Directions</button>';

  

this.addInfoWindow(marker, content);
    });
      }

   

 },
  err=>{  console.log('error:'+err);});
}

loadDirection(lat,lng)
{



    this.directionsService.route({
      origin: this.mylatLng,
      destination: new google.maps.LatLng(lat, lng),
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
      } else {
        console.log('Directions request failed due to ' + status);
      }
    });

}



addInfoWindow(marker, content){

let infoWindow = new google.maps.InfoWindow({
content: content
});

google.maps.event.addListener(marker, 'click', () => {
infoWindow.open(this.map, marker);
});

}



}










