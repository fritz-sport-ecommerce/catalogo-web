export default  function newUser(isnew: boolean, monto: number,deliberyPrice: number) {

 
      if (isnew) {
        if (monto > 500) {
          return Number(monto.toFixed(2))
        }else {
          const operation =  Number(monto + deliberyPrice);
          return Number(operation.toFixed(2))
        }
      
      } else {
        
        return Number((monto + deliberyPrice).toFixed(2));
      }


}


