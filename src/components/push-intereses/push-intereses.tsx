import React from 'react'

export default function PushIntereses() {
  return (
    <div>push-intereses</div>
  )
}


// "use client";

// import { client } from "@/sanity/lib/client";
// import { useSession } from "next-auth/react";
// import { useEffect } from "react";

// export default function PushIntereses({ users, product }) {
//   //   console.log(users);

//   const { data: session } = useSession();
//   //   console.log(session?.user.id);
//   useEffect(() => {
//     if (session?.user.id) {
//       let result = users.find((el) => el._id === session?.user.id);
//       client
//         .patch(result._id)
//         // Ensure that the `reviews` arrays exists before attempting to add items to it
//         .setIfMissing({ intereses: [] })
//         .append("intereses", [product.sku])
//         .commit({ autoGenerateArrayKeys: true })
//         .then((resultad) => {
//           console.log(resultad);
//         });
//     }
//   }, [product.sku]);

//   return (
//     <div className="text-white">
//       {session?.user ? <div>{session.user.name}</div> : <div>test</div>}
//     </div>
//   );
// }
