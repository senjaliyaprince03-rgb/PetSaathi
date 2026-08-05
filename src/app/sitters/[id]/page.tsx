import Map from "@/components/Map";

export default function SitterPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <h1 className="text-2xl font-bold mb-4">Sitter Location</h1>
      <Map
        lat={21.1702}   // sitter's latitude
        lng={72.8311}   // sitter's longitude
        zoom={13}
        markers={[
          { lat: 21.1702, lng: 72.8311, label: "Rahul's Pet Care" }
        ]}
      />
    </div>
  );
}
