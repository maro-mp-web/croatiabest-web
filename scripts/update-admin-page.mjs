import fs from 'fs';

let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Add hook
if (!content.includes("useCollection('homepage_sections'")) {
  content = content.replace(
    /const \{ data: islands[^;]+;/g,
    `$&

  const { data: homepageSections, isLoading: sectionsLoading } = useCollection('homepage_sections', {
    sort: 'order',
  });`
  );
}

// 2. Add 'sections' to activeTab state
content = content.replace(
  /useState<'listings' \| 'blogs' \| 'cities' \| 'islands' \| 'parks'>\('listings'\);/g,
  `useState<'listings' | 'blogs' | 'cities' | 'islands' | 'parks' | 'sections'>('listings');`
);

// 3. Add 'section' to editType
content = content.replace(
  /useState<'city' \| 'island' \| 'park' \| null>\(null\);/g,
  `useState<'city' | 'island' | 'park' | 'section' | null>(null);`
);

// 4. Add handlers
if (!content.includes('startEditSection')) {
  content = content.replace(
    /const startEditIsland =[\s\S]*?setIsEditing\(true\);\n  };/g,
    `$&

  const startEditSection = (sectionItem?: any) => {
    setEditType('section');
    if (sectionItem) {
      setEditId(sectionItem.id);
      setFormData({
        title: sectionItem.title || '',
        type: sectionItem.type || 'custom',
        content: sectionItem.content || '',
        image: sectionItem.image || '',
        order: sectionItem.order || 1,
        isActive: sectionItem.isActive !== false,
      });
    } else {
      setEditId(null);
      setFormData({
        title: '',
        type: 'custom',
        content: '',
        image: '',
        order: (homepageSections?.length || 0) + 1,
        isActive: true,
      });
    }
    setIsEditing(true);
  };`
  );
}

if (!content.includes('handleDeleteSection')) {
  content = content.replace(
    /const handleDeleteIsland =[\s\S]*?}\n  };/g,
    `$&

  const handleDeleteSection = async (id: string) => {
    if (!pb) return;
    if (confirm('Jeste li sigurni da želite obrisati ovu sekciju?')) {
      try {
        await pb.collection('homepage_sections').delete(id);
        window.location.reload();
      } catch (error) {
        console.error('Section delete error:', error);
      }
    }
  };`
  );
}

if (!content.includes("editType === 'section'")) {
  content = content.replace(
    /if \(editType === 'park'\) \{[\s\S]*?\}\n        \}/g,
    `$&
        if (editType === 'section') {
          data = {
            title: formData.title,
            type: formData.type,
            content: formData.content,
            image: formData.image,
            order: parseInt(formData.order) || 1,
            isActive: formData.isActive
          };
          if (editId) {
            await pb.collection('homepage_sections').update(editId, data);
          } else {
            await pb.collection('homepage_sections').create(data);
          }
        }`
  );
}

// 5. Add Tab
if (!content.includes("id: 'sections'")) {
  content = content.replace(
    /\{ id: 'parks', name: 'Nacionalni parkovi', icon: <Trees className="size-4" \/> \}/g,
    `$&,
            { id: 'sections', name: 'Naslovnica', icon: <Sparkles className="size-4" /> }`
  );
}

// 6. Add form fields for section
const sectionFormFields = `
                  {editType === 'section' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Naslov sekcije</label>
                          <Input 
                            value={formData.title} 
                            onChange={e => setFormData({...formData, title: e.target.value})} 
                            placeholder="npr. Istražite gradove" 
                            required 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Vrsta (Template)</label>
                          <select 
                            className="w-full h-10 px-3 rounded-lg border bg-white font-medium text-sm"
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value})}
                          >
                            <option value="custom">Custom HTML / Slike i Tekst</option>
                            <option value="cities">Gradovi (Grid)</option>
                            <option value="islands">Otoci (Grid)</option>
                            <option value="premium">Premium Lokacije</option>
                            <option value="popular_listings">Popularne Lokacije</option>
                            <option value="public_listings">Znamenitosti / Javne</option>
                            <option value="monuments">Spomenici i Povijest</option>
                            <option value="history_articles">Članci: Povijest</option>
                            <option value="war_articles">Članci: Domovinski Rat</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Redoslijed (Order)</label>
                          <Input 
                            type="number"
                            value={formData.order} 
                            onChange={e => setFormData({...formData, order: e.target.value})} 
                            required 
                          />
                        </div>
                        <div className="space-y-1 flex flex-col justify-end">
                          <label className="flex items-center gap-2 cursor-pointer p-2 border rounded-lg bg-slate-50">
                            <input 
                              type="checkbox" 
                              checked={formData.isActive} 
                              onChange={e => setFormData({...formData, isActive: e.target.checked})}
                              className="w-5 h-5 accent-primary"
                            />
                            <span className="font-bold text-sm">Prikaži na naslovnici (Aktivno)</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Fotografija (Opcionalno)</label>
                        <div className="flex flex-col gap-3">
                          <Input 
                            value={formData.image} 
                            onChange={e => setFormData({...formData, image: e.target.value})} 
                            placeholder="URL slike..." 
                          />
                          <ImageUpload 
                            defaultImage={formData.image}
                            onUploadComplete={(url) => setFormData((prev) => ({...prev, image: url}))} 
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Opis / Sadržaj (Podržava poveznice, stilove)</label>
                        <RichTextEditor 
                          value={formData.content} 
                          onChange={(html) => setFormData({...formData, content: html})} 
                          placeholder="Upiši tekst sekcije..." 
                        />
                      </div>
                    </div>
                  )}
`;

if (!content.includes("editType === 'section' &&")) {
  content = content.replace(
    /\{editType === 'park' && \([\s\S]*?\)\}/g,
    `$&${sectionFormFields}`
  );
}

// 7. Add Sections List UI
const sectionsListUI = `
        {/* TAB: SECTIONS */}
        {activeTab === 'sections' && (
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b p-8 bg-secondary/5">
              <div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">Sekcije Naslovnice</CardTitle>
                <CardDescription>Upravljanje dinamičkim blokovima na početnoj stranici.</CardDescription>
              </div>
              <Button onClick={() => startEditSection()} className="bg-primary hover:bg-primary/90 text-white rounded-full font-bold px-6 h-12 shadow-lg hover:shadow-xl transition-all">
                <PlusCircle className="mr-2 size-5" /> Nova Sekcija
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {sectionsLoading ? (
                <div className="p-24 flex justify-center"><Loader2 className="animate-spin size-8 text-primary" /></div>
              ) : (
                <div className="divide-y divide-black/5 text-left">
                  {!homepageSections || homepageSections.length === 0 ? (
                    <div className="p-16 text-center text-slate-400 font-medium">
                      Nema dodanih sekcija.
                    </div>
                  ) : (
                    homepageSections.map((sec) => (
                      <div key={sec.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-xl text-slate-400">
                            {sec.order}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                              {sec.title}
                              {!sec.isActive && <Badge variant="outline" className="text-xs">Neaktivno</Badge>}
                            </h3>
                            <div className="text-sm text-slate-500 mt-1 flex items-center gap-3">
                              <span>Tip: <strong className="uppercase text-[10px] bg-slate-100 px-2 py-0.5 rounded-full">{sec.type}</strong></span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <Button variant="outline" size="sm" onClick={() => startEditSection(sec)} className="flex-1 md:flex-none">
                            <Edit2 className="size-4 mr-2" /> Uredi
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteSection(sec.id)} className="flex-1 md:flex-none">
                            <Trash2 className="size-4 mr-2" /> Obriši
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
`;

if (!content.includes("activeTab === 'sections'")) {
  content = content.replace(
    /\{\/\* TAB 6: ADMIN STATS \*\/}/g,
    `${sectionsListUI}\n\n        {/* TAB 6: ADMIN STATS */}`
  );
}

fs.writeFileSync('src/app/admin/page.tsx', content, 'utf8');
console.log("Updated admin/page.tsx successfully.");
