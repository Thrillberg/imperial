import{_ as d,r as a,o as n,c as _,w as o,b as i,d as m,F as p,f as e,a as h,t as r}from"./index-dfdf83d7.js";const u={name:"FinishedGames",props:{profile:{type:Object,default:()=>{}}},data:()=>({games:[]}),created(){document.title="Finished Games - Imperial",fetch("http://localhost:3000/api/games?filter=finished",{method:"GET"}).then(t=>t.json()).then(t=>{this.games=t})}},f=e("b",null,"All Finished Games",-1),b=e("div",{class:"flex border-b border-black mt-2"},[e("div",{class:"w-1/2"},[e("b",null,"Name")]),e("div",{class:"w-1/2"},[e("b",null,"Winner")])],-1),v={class:"w-1/2"},w={class:"w-1/2"};function k(t,g,y,F,x,G){const c=a("router-link"),l=a("v-container");return n(),_(l,null,{default:o(()=>[f,b,(n(!0),i(p,null,m(t.games,s=>(n(),i("div",{key:s.id},[h(c,{to:{path:"/game/"+s.id},class:"flex justify-between items-center hover:bg-gray-200 py-2"},{default:o(()=>[e("div",v,r(s.name),1),e("div",w,r(s.winner_name),1)]),_:2},1032,["to"])]))),128))]),_:1})}const B=d(u,[["render",k]]);export{B as default};
