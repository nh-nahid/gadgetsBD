const HeroBanner = () => {
  return (
    <div
      className="relative w-full h-64 md:h-80 bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2574")',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-amazon-background to-transparent" />
    </div>
  );
};

export default HeroBanner;
