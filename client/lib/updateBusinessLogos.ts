// Function to update business logos with working URLs
export const updateBusinessLogos = (businesses: any[]) => {
  const logoUrls = [
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop&crop=center", // Office building
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=80&h=80&fit=crop&crop=center", // Business handshake
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=center", // Professional man
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=center", // Professional woman
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=80&h=80&fit=crop&crop=center", // Business meeting
    "https://images.unsplash.com/photo-1553484771-371a605b060b?w=80&h=80&fit=crop&crop=center", // Office space
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=80&h=80&fit=crop&crop=center", // Documents
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=80&h=80&fit=crop&crop=center", // Globe/international
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=80&h=80&fit=crop&crop=center", // Business team
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=80&h=80&fit=crop&crop=center", // Office workspace
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80&h=80&fit=crop&crop=center", // Passport/travel
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=80&h=80&fit=crop&crop=center", // Luxury building
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=80&h=80&fit=crop&crop=center", // Airplane/travel
  ];

  const coverUrls = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop&crop=center", // Modern office
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop&crop=center", // Business workspace
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=200&fit=crop&crop=center", // Professional meeting
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=200&fit=crop&crop=center", // Team collaboration
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop&crop=center", // Office interior
  ];

  return businesses.map((business, index) => ({
    ...business,
    logo: logoUrls[index % logoUrls.length],
    coverImage: business.coverImage
      ? coverUrls[index % coverUrls.length]
      : business.coverImage,
    gallery: business.gallery?.map(
      (_, galleryIndex) =>
        `https://images.unsplash.com/photo-${1486406146926 + galleryIndex}?w=300&h=200&fit=crop&crop=center`,
    ),
  }));
};
