module Jekyll
  class SectionBlock < Liquid::Block
    def initialize(tag_name, args, tokens)
      img_dirs = ["left", "right"]
      img_pos = ["center", "bottom"]
      @args = Helpers.parse_args(args)

      if ![2,3].include? @args.length
        raise "Invalid number of arguments. Expected 2 or 3 got #{@args.length}."
      end

      @img_src = nil
      @img_pos = nil
      @img_dir = nil

      @args.each do |arg|
        if img_dirs.include?(arg) && @img_dir.nil?
          @img_dir = arg
        elsif img_pos.include?(arg) && @img_pos.nil? && @args.length == 3
          @img_pos = arg
        elsif @img_src.nil?
          @img_src = arg
        end
      end

      if @img_dir.nil?
        raise "Must provide a valid image direction (left or right)."
      end

      @img_pos = @img_pos || "bottom"

      # Remove all leading '/' characters just to be sure
      @img_src = "/img/" + @img_src.gsub(/^\/+/, "")

      super
    end

    def render(context)
      site = context.registers[:site]
      contents = super
      converter = site.find_converter_instance(::Jekyll::Converters::Markdown)

      # pipe param through liquid to make additional replacements possible
      content = converter.convert(contents)

<<EOS
<section class="info #{@img_dir}">
  <div>
    <div class="text">
      #{content}
    </div>

    <div class="img-wrapper #{@img_pos}">
      <img src="#{@img_src}"/>
    </div>
  </div>
</section>
EOS
    end
  end
end

Liquid::Template.register_tag("section", Jekyll::SectionBlock)
